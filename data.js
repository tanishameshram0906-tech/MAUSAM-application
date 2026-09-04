/**
 * Mausam Creative MVP data
 * Action-first weather personalization for the hackathon demo.
 */
const PERSONA_WIDGETS = {
  farmer: {
    lang: "MR",
    locName: "Nashik, Maharashtra",
    greeting: "नमस्कार, शेतकरी",
    temp: "29°",
    tempDesc: "Partly cloudy · Feels like 32° · H:31° L:22°",
    action: {
      eyebrow: "TODAY'S DECISION",
      title: "You can sow today.",
      body: "Soil moisture is favourable and the next 2 days are suitable for sowing.",
      reason: "Because soil moisture is 78% and rain is expected later."
    },
    widgets: [
      { id:"sow-window", icon:"🌱", color:"#5d8f45", title:"Sowing-safe window", subtitle:"Next 3 days are favourable for sowing — soil moisture is optimal." },
      { id:"harvest-adv", icon:"🌾", color:"#b8792e", title:"Harvest advisory", subtitle:"Delay harvest of standing crop until rain clears." },
      { id:"soil-moist", icon:"💧", color:"#2787a5", title:"Soil moisture", subtitle:"78% saturation — irrigation is not needed this week." },
      { id:"rain-outlook", icon:"🌧️", color:"#426d83", title:"Rainfall outlook", subtitle:"Above-normal rainfall expected across the district." },
      { id:"sat-view", icon:"🛰️", color:"#4f8b83", title:"Satellite view", subtitle:"Cloud cover is moving in from the Arabian Sea." },
      { id:"uv-index", icon:"☀️", color:"#d58b2d", title:"Fieldwork window", subtitle:"Moderate UV — safer fieldwork before 11 AM." }
    ]
  },
  fisherman: {
    lang: "MR",
    locName: "Ratnagiri, Maharashtra",
    greeting: "नमस्कार, मच्छीमार",
    temp: "27°",
    tempDesc: "Windy · Feels like 28° · H:29° L:24°",
    action: {
      eyebrow:"TODAY'S DECISION",
      title:"Stay ashore today.",
      body:"Waves may reach 4m tonight and winds are strong.",
      reason:"Because sea conditions are rough along the Konkan coast."
    },
    widgets:[
      {id:"wind-speed",icon:"🌬️",color:"#3185a0",title:"Wind conditions",subtitle:"32 km/h from SW — rough sea conditions."},
      {id:"wave-height",icon:"〰️",color:"#3c6d83",title:"Wave forecast",subtitle:"Peaking near 4m tonight, easing by Friday morning."},
      {id:"safe-zones",icon:"🧭",color:"#4c8b83",title:"Safe fishing zones",subtitle:"No PFZ advisories currently active nearby."},
      {id:"cyclone",icon:"🌀",color:"#c94b42",title:"Cyclone watch",subtitle:"No active systems in the Arabian Sea."},
      {id:"tide",icon:"🌊",color:"#d08a31",title:"Tide timings",subtitle:"High tide 6:42 AM and 7:10 PM."},
      {id:"radio",icon:"📡",color:"#557e54",title:"VHF advisory",subtitle:"Channel 16 — daily coastal bulletin at 6 AM."}
    ]
  },
  commuter: {
    lang:"EN",
    locName:"Mumbai, Maharashtra",
    greeting:"Good evening",
    temp:"30°",
    tempDesc:"Light showers · Feels like 33° · H:32° L:26°",
    action:{
      eyebrow:"YOUR COMMUTE",
      title:"Leave 20 minutes early.",
      body:"Rain is likely during the evening peak and may slow the Western Express Highway.",
      reason:"Because an intense shower band is approaching around 5–7 PM."
    },
    widgets:[
      {id:"next-3h",icon:"⏱️",color:"#426f86",title:"Next 3 hours",subtitle:"Rain likely around 5:15 PM, easing by 7 PM."},
      {id:"traffic",icon:"🚦",color:"#687f8b",title:"Traffic impact",subtitle:"Western Express Highway: moderate slowdown expected."},
      {id:"aqi",icon:"🌫️",color:"#3c8ba4",title:"Air quality",subtitle:"AQI 118 — moderate; sensitive groups take care."},
      {id:"umbrella",icon:"☂️",color:"#d59035",title:"Rain cover",subtitle:"80% chance of rain during your usual commute."},
      {id:"outlook7",icon:"📅",color:"#52825d",title:"Week ahead",subtitle:"Monsoon activity continues through the week."},
      {id:"radar",icon:"🛰️",color:"#6d665d",title:"Live radar",subtitle:"Rain band approaching from the Arabian Sea."}
    ]
  },
  citizen: {
    lang:"EN",
    locName:"Pune, Maharashtra",
    greeting:"Good afternoon",
    temp:"31°",
    tempDesc:"Partly cloudy · Feels like 34° · H:33° L:24°",
    action:{
      eyebrow:"TODAY FOR YOU",
      title:"Plan the outdoors before noon.",
      body:"UV will be high around midday, while the evening stays more comfortable.",
      reason:"Because the UV index is expected to reach 7."
    },
    widgets:[
      {id:"today",icon:"☀️",color:"#d88c2e",title:"Today's weather",subtitle:"Partly cloudy through the afternoon, clearer evening."},
      {id:"outlook7c",icon:"📅",color:"#3988a0",title:"7-day forecast",subtitle:"Mild showers expected over the weekend."},
      {id:"uv",icon:"🌡️",color:"#416c84",title:"UV index",subtitle:"High (7) — sunscreen recommended around midday."},
      {id:"aqic",icon:"🌫️",color:"#68818b",title:"Air quality",subtitle:"AQI 92 — satisfactory."},
      {id:"satc",icon:"🛰️",color:"#4d805c",title:"Satellite view",subtitle:"Clear skies over the Deccan plateau."},
      {id:"sunrise",icon:"🌅",color:"#786555",title:"Sunrise & sunset",subtitle:"6:12 AM — 6:48 PM."}
    ]
  }
};

const ALERTS = {
  farmer:{tag:"IMD DISTRICT ALERT",icon:"⚠️",title:"Heavy rainfall expected",body:"60–80mm rainfall likely in the next 24 hrs. Delay pesticide spraying and secure harvested stock."},
  fisherman:{tag:"COASTAL ALERT",icon:"🌊",title:"High wave warning",body:"Wave height 3.2–4m expected. Fishermen are advised not to venture into the sea for 48 hours."},
  commuter:{tag:"CITY ALERT",icon:"🌧️",title:"Waterlogging risk",body:"Intense rain expected 5–7 PM during evening peak hours. Plan your commute accordingly."},
  citizen:null
};

const userState = {};
function getUser(userId){
  if(!userState[userId]) userState[userId]={persona:"farmer",boosts:{}};
  return userState[userId];
}
module.exports={PERSONA_WIDGETS,ALERTS,userState,getUser};
