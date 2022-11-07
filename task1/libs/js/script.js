let timeZoneLat = 0;
let timeZoneLng = 0;

let latitude = 55;
let longitude = 21;

let oceanLat = 0;
let oceanLng = 0;

// const timezoneUrl = `http://api.geonames.org/timezoneJSON?lat=${latitude}&lng=${longitude}&username=antch`;

// const oceanNameUrl = `http://api.geonames.org/oceanJSON?lat=${oceanLat}&lng=${oceanLng}&username=antch`;

// const weatherUrl = "http://api.geonames.org/weatherJSON?north=68&south=-45&east=-80&west=100&username=antch";

const phpApi = "http://localhost/task1/libs/php/api.php";

// Timezone code
const latitudeInput = document.getElementById("LatInput");
document.getElementById("LatInput").addEventListener("change", (e) => {
  timeZoneLat = e.target.value;
});

const longitudeInput = document.getElementById("LngInput");
longitudeInput.addEventListener("change", (e) => {
  timeZoneLng = e.target.value;
});

// Ocean code

const oceanLatInput = document.getElementById("oceanLatInput");
document.getElementById("oceanLatInput").addEventListener("change", (e) => {
  oceanLat = e.target.value;
});

const oceanLngInput = document.getElementById("oceanLngInput");
oceanLngInput.addEventListener("change", (e) => {
  oceanLng = e.target.value;
});

function onSuccess(result) {
  console.log(result);
  alert(JSON.stringify(result));
}

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

function oceanName() {
  whenIClickTheButton(`${phpApi}?api=ocean&lat=${oceanLat}&lng=${oceanLng}`);
}

function getTheWeatherInformation() {
  whenIClickTheButton(weatherUrl);
}

function callPHPApi() {
  whenIClickTheButton(phpApi);
}

$("#timezone-send").click(getTimezone);
$("#weather-send").click(getTheWeatherInformation);
$("#ocean-send").click(oceanName);
