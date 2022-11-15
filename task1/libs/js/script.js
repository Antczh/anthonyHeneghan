let timeZoneLat = 0;
let timeZoneLng = 0;

let north = 0;
let east = 0;
let south = 0;
let west = 0;

let oceanLat = 0;
let oceanLng = 0;

const phpApi = "http://anthonyheneghan.co.uk/libs/php/api.php";

// Timezone code
const latitudeInput = document.getElementById("LatInput");
document.getElementById("LatInput").addEventListener("change", (e) => {
  timeZoneLat = e.target.value;
});

const longitudeInput = document.getElementById("LngInput");
longitudeInput.addEventListener("change", (e) => {
  timeZoneLng = e.target.value;
});

// Weather
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

function weatherInfo() {
  whenIClickTheButton(
    `${phpApi}?api=weather&north=${north}&south=${south}&east=${east}&west=${west}`
  );
}

function callPHPApi() {
  whenIClickTheButton(phpApi);
}

$("#timezone-send").click(getTimezone);
$("#weather-send").click(weatherInfo);
$("#ocean-send").click(oceanName);
