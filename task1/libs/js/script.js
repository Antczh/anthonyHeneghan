let timeZoneLat = 0;
let timeZoneLng = 0;

let north = 0;
let east = 0;
let south = 0;
let west = 0;

let oceanLat = 0;
let oceanLng = 0;

const phpApi = "http://anthonyheneghan.co.uk/libs/php/api.php";

// Timezone preset
const setTimezoneCoordinates = (lat, lng) => {
  timeZoneLat = lat;
  timeZoneLng = lng;
  document.getElementById("LatInput").value = lat;
  document.getElementById("LngInput").value = lng;
};

const setTimezoneValues = () => {
  setTimezoneCoordinates(41.902782, 12.496366);
};

// Weather preset
const setWeatherCoordinates = (n, e, s, w) => {
  north = n;
  east = e;
  south = s;
  west = w;
  document.getElementById("northInput").value = n;
  document.getElementById("eastInput").value = e;
  document.getElementById("southInput").value = s;
  document.getElementById("westInput").value = w;
};

const setWeatherValues = () => {
  setWeatherCoordinates(44.1, -22.4, -9.9, 55.2);
};

// Ocean preset
const setOceanCoordinates = (oceanLat, oceanLng) => {
  oceanLat = oceanLat;
  oceanLng = oceanLng;
  document.getElementById("oceanLatInput").value = oceanLat;
  document.getElementById("oceanLngInput").value = oceanLng;
};

const setOceanValues = () => {
  setOceanCoordinates(-14, -28);
};

// Timezone event code
const latitudeInput = document.getElementById("LatInput");
document.getElementById("LatInput").addEventListener("change", (e) => {
  timeZoneLat = e.target.value;
});

const longitudeInput = document.getElementById("LngInput");
longitudeInput.addEventListener("change", (e) => {
  timeZoneLng = e.target.value;
});

// Weather event code
const northInput = document.getElementById("northInput");
document.getElementById("northInput").addEventListener("change", (e) => {
  north = e.target.value;
});

const eastInput = document.getElementById("eastInput");
document.getElementById("eastInput").addEventListener("change", (e) => {
  east = e.target.value;
});

const southInput = document.getElementById("southInput");
document.getElementById("southInput").addEventListener("change", (e) => {
  south = e.target.value;
});

const westInput = document.getElementById("westInput");
document.getElementById("westInput").addEventListener("change", (e) => {
  west = e.target.value;
});

// Ocean event code

const oceanLatInput = document.getElementById("oceanLatInput");
document.getElementById("oceanLatInput").addEventListener("change", (e) => {
  oceanLat = e.target.value;
});

const oceanLngInput = document.getElementById("oceanLngInput");
oceanLngInput.addEventListener("change", (e) => {
  oceanLng = e.target.value;
});

// Timezone display results

function onSuccess(result) {
  console.log(result);

  const country = document.getElementById("countryName");
  country.innerHTML = result.data.countryName;

  const sunrise = document.getElementById("timezoneSunrise");
  sunrise.innerHTML = result.data.sunrise;

  const sunset = document.getElementById("timezoneSunset");
  sunset.innerHTML = result.data.sunset;

  const time = document.getElementById("timezoneCurrentTime");
  time.innerHTML = result.data.time;
}

// // Weather display results
// function onSuccess(result) {
//   console.log(result);

//   const stationName = document.getElementById("stationName");
//   stationName.innerHTML = result.data.weatherObservations.stationName;
// }

// // Ocean display results
// function onSuccess(result) {
//   console.log(result);

//   const oceanName = document.getElementById("oceanName");
//   oceanName.innerHTML = result.data.ocean.name;

//   const oceanDistance = document.getElementById("oceanDistance");
//   oceanDistance.innerHTML = result.data.ocean.distance;
// }

// Ajax function
function whenIClickTheButton(url) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: onSuccess,
  });
}

function getTimezone() {
  whenIClickTheButton(
    `${phpApi}?api=timezone&lat=${timeZoneLat}&lng=${timeZoneLng}`
  );
}

function weatherInfo() {
  whenIClickTheButton(
    `${phpApi}?api=weather&north=${north}&south=${south}&east=${east}&west=${west}`
  );
}

function oceanName() {
  whenIClickTheButton(`${phpApi}?api=ocean&lat=${oceanLat}&lng=${oceanLng}`);
}

function callPHPApi() {
  whenIClickTheButton(phpApi);
}

$("#timezone-send").click(getTimezone);
$("#weather-send").click(weatherInfo);
$("#ocean-send").click(oceanName);
