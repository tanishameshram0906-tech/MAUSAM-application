Server.js:- 


/**
 * MAUSAM — Creative MVP Backend
 */

const http = require("http");
const url = require("url");

const {
  PERSONA_WIDGETS,
  ALERTS,
  getUser
} = require("./data");

const PORT = process.env.PORT || 4000;


// --------------------------------------------------
// Send JSON response
// --------------------------------------------------

function sendJSON(res, statusCode, payload) {

  const body = JSON.stringify(payload);

  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),

    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });

  res.end(body);
}


// --------------------------------------------------
// Read POST request body
// --------------------------------------------------

function readBody(req) {

  return new Promise((resolve, reject) => {

    let data = "";

    req.on("data", chunk => {
      data += chunk;
    });

    req.on("end", () => {

      if (!data) {
        return resolve({});
      }

      try {
        resolve(JSON.parse(data));
      }

      catch (error) {
        reject(error);
      }

    });

    req.on("error", reject);

  });

}


// --------------------------------------------------
// Check valid persona
// --------------------------------------------------

function isValidPersona(persona) {

  return Object.prototype.hasOwnProperty.call(
    PERSONA_WIDGETS,
    persona
  );

}


// --------------------------------------------------
// Personalization / ranking engine
// --------------------------------------------------

function rankWidgets(baseWidgets, boostedIds) {

  if (!boostedIds || boostedIds.length === 0) {
    return baseWidgets;
  }

  const pool = [...baseWidgets];

  const boosted = [];

  boostedIds.forEach(id => {

    const index = pool.findIndex(
      widget => widget.id === id
    );

    if (index !== -1) {

      boosted.push(
        pool.splice(index, 1)[0]
      );

    }

  });

  return [

    ...boosted.map(widget => ({
      ...widget,
      boosted: true
    })),

    ...pool

  ];

}


// --------------------------------------------------
// GET /api/home
// --------------------------------------------------

function handleHome(req, res, query) {

  const persona =
    query.persona || "farmer";

  const userId =
    query.userId || "demo-user";


  // Validate persona

  if (!isValidPersona(persona)) {

    return sendJSON(
      res,
      400,
      {
        error:
          `Unknown persona '${persona}'`
      }
    );

  }


  // Get user state

  const user = getUser(userId);

  const template =
    PERSONA_WIDGETS[persona];


  // Get user's previously selected widgets

  const boostedIds =
    user.boosts[persona] || [];


  // Create personalized response

  const response = {

    persona,

    profile: {

      lang:
        template.lang,

      locName:
        template.locName,

      greeting:
        template.greeting,

      temp:
        template.temp,

      tempDesc:
        template.tempDesc,

      action:
        template.action

    },

    alert:
      ALERTS[persona] || null,

    widgets:
      rankWidgets(
        template.widgets,
        boostedIds
      )

  };


  sendJSON(
    res,
    200,
    response
  );

}


// --------------------------------------------------
// POST /api/track-tap
// --------------------------------------------------

async function handleTrackTap(req, res) {

  let body;

  try {

    body =
      await readBody(req);

  }

  catch (error) {

    return sendJSON(
      res,
      400,
      {
        error: "Invalid JSON body"
      }
    );

  }


  const {

    userId = "demo-user",

    persona,

    widgetId

  } = body;


  // Validate persona

  if (!isValidPersona(persona)) {

    return sendJSON(
      res,
      400,
      {
        error:
          `Unknown persona '${persona}'`
      }
    );

  }


  // Validate widget

  if (!widgetId) {

    return sendJSON(
      res,
      400,
      {
        error:
          "widgetId is required"
      }
    );

  }


  const user =
    getUser(userId);


  // Create persona history

  if (!user.boosts[persona]) {

    user.boosts[persona] = [];

  }


  // Remove duplicate

  user.boosts[persona] =
    user.boosts[persona].filter(
      id => id !== widgetId
    );


  // Put selected widget first

  user.boosts[persona].unshift(
    widgetId
  );


  // Keep only top 3 preferences

  user.boosts[persona] =
    user.boosts[persona].slice(0, 3);


  // Get current persona data

  const template =
    PERSONA_WIDGETS[persona];


  // Re-rank widgets

  const widgets =
    rankWidgets(
      template.widgets,
      user.boosts[persona]
    );


  sendJSON(
    res,
    200,
    {

      ok: true,

      persona,

      widgets

    }
  );

}


// --------------------------------------------------
// POST /api/set-persona
// --------------------------------------------------

async function handleSetPersona(req, res) {

  let body;

  try {

    body =
      await readBody(req);

  }

  catch (error) {

    return sendJSON(
      res,
      400,
      {
        error: "Invalid JSON body"
      }
    );

  }


  const {

    userId = "demo-user",

    persona

  } = body;


  if (!isValidPersona(persona)) {

    return sendJSON(
      res,
      400,
      {
        error:
          `Unknown persona '${persona}'`
      }
    );

  }


  const user =
    getUser(userId);


  user.persona =
    persona;


  sendJSON(
    res,
    200,
    {

      ok: true,

      persona

    }
  );

}


// --------------------------------------------------
// HTTP SERVER
// --------------------------------------------------

const server =
  http.createServer(
    async (req, res) => {

      const parsed =
        url.parse(
          req.url,
          true
        );


      const pathname =
        parsed.pathname;

      const query =
        parsed.query;


      // CORS preflight

      if (
        req.method === "OPTIONS"
      ) {

        return sendJSON(
          res,
          204,
          {}
        );

      }


      // ----------------------------------------------
      // Home API
      // ----------------------------------------------

      if (
        req.method === "GET" &&
        pathname === "/api/home"
      ) {

        return handleHome(
          req,
          res,
          query
        );

      }


      // ----------------------------------------------
      // Behaviour tracking
      // ----------------------------------------------

      if (
        req.method === "POST" &&
        pathname === "/api/track-tap"
      ) {

        return handleTrackTap(
          req,
          res
        );

      }


      // ----------------------------------------------
      // Persona selection
      // ----------------------------------------------

      if (
        req.method === "POST" &&
        pathname === "/api/set-persona"
      ) {

        return handleSetPersona(
          req,
          res
        );

      }


      // ----------------------------------------------
      // Health check
      // ----------------------------------------------

      if (
        req.method === "GET" &&
        pathname === "/api/health"
      ) {

        return sendJSON(
          res,
          200,
          {

            status: "ok",

            service:
              "mausam-backend"

          }
        );

      }


      // ----------------------------------------------
      // Unknown route
      // ----------------------------------------------

      sendJSON(
        res,
        404,
        {

          error: "Not found",

          path: pathname

        }
      );

    }
  );


// --------------------------------------------------
// Start server
// --------------------------------------------------

server.listen(
  PORT,
  () => {

    console.log(
      `Mausam backend running at http://localhost:${PORT}`
    );

    console.log(
      `Test API: http://localhost:${PORT}/api/home?persona=farmer`
    );

  }
);
