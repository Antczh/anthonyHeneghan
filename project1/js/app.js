let countryList = [];
let geometry = [];
let coords = [];
let polygon = "";
let markerCountry = "";
let mapIcon = L.icon({
  iconUrl: "./css/img/mapLocationIcon.png",
  iconSize: [48, 48], // size of the icon
  iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -48], // point from which the popup should open relative to the iconAnchor
});
const map = L.map("map").setView([0, 0], 2);

navigator.geolocation.getCurrentPosition(success, error);
let marker;

function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  marker = L.marker([lat, lng], { icon: mapIcon });
  marker.addTo(map).bindPopup("You are here!").openPopup();
  map.setView([lat, lng], 10);
}

function error(err) {
  if (err.code === 1) {
    alert("Please allow location access");
  } else {
    alert("Cannot get location");
  }
}

$.ajax({
  type: "GET",
  url: "php/request.php",
  dataType: "json",
  success: function (data) {
    countryList = data.data.features;
    countryList.forEach((item) => {
      $("#country").append(
        `<option id="countryId" value="${item.properties.iso_a2}">${item.properties.name}</option>`
      );
    });
  },
  error: function (jqXHR, textStatus, errorThrown) {
    alert(errorThrown + " " + jqXHR + " " + textStatus);
  },
});

document.getElementById("country").addEventListener("change", function (event) {
  map.removeLayer(marker);

  if (event.target.value) {
    const country = countryList.filter(
      (item) => item.properties.iso_a2 == event.target.value
    );

    $.ajax({
      url: "php/getLatLng.php?c=" + country[0].properties.iso_a2,
      type: "GET",
      dataType: "json",
      success: function (res) {
        map.setView(res[0].latlng, 6);
        if (markerCountry != "") {
          map.removeLayer(markerCountry);
        }
        markerCountry = L.marker(res[0].latlng);
        markerCountry.addTo(map).bindPopup("You have arrived!").openPopup();

        const latlngs = [];

        $.ajax({
          url: "php/polygon.php",
          type: "GET",
          dataType: "json",
          success: function (res) {
            for (let i = 0; i < res.features.length; i++) {
              if (
                country[0].properties.iso_a2 ==
                res.features[i].properties.iso_a2
              ) {
                latlngs.push(res.features[i].geometry.coordinates);
                if (polygon != "") {
                  map.removeLayer(polygon);
                }
                polygon = L.geoJSON(res.features[i], {
                  style: function (feature) {
                    return { color: "red" };
                  },
                }).bindPopup(function (layer) {
                  return layer.feature.properties.geometry;
                });

                polygon.addTo(map);

                map.fitBounds(polygon.getBounds());
                break;
              }
            }
          },
        });
      },
    });
  }
});

document.getElementById("discoverBtn").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/server.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      let capital = res["data"][0].capital;
      let population = res["data"][0].population;
      let countryName = res["data"][0].countryName;
      let currency = res["data"][0].currencyCode;
      let currentWeather = res["data"][0].weather;
      let wikipedia = res["data"][0].wiki;

      jQuery("#exampleModal .modal-body")
        .html(`<table class="retrievedInfoTable">
  <tr>
    <td>Country:</td>
    <td id="countryName">${countryName}</td>
  </tr>

  <tr>
    <td>Capital:</td>
    <td id="capitalName">${capital}</td>
  </tr>

  <tr>
    <td>Population:</td>
    <td id="countryPopulation">${population}</td>
  </tr>

  <tr>
    <td>Currency:</td>
    <td id="countryPopulation">${currency}</td>
  </tr>

  <tr>
    <td>Current Weather:</td>
    <td id="countryWeather">${currentWeather}</td>
  </tr>

  <tr>
    <td>Wikipedia Link:</td>
      <td id="wikiLinks"><a href="https://${wikipedia}">${wikipedia}</a></td>
  </tr>
</table>`);
    },
  });
});
// <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png"  <h3 class="card-title"></h3>

document.getElementById("weatherModalInfo").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/openWeather.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      let temp = res["data"][0].weather;
      let tempFeels = "feelLikeTemp";
      let tempMax = "tempMax";
      let tempMin = "tempMin";
      let humidity = "humidity";

      jQuery("#weatherModal .modal-body").html(` <div class="card-body">
  <img src="http://openweathermap.org/img/wn/10d@2x.png">
  <p class="card-text">Temp ${temp}</p>
  <p class="card-text">Temp feels like</p>
  <p class="card-text">Temp min</p>
  <p class="card-text">Temp max</p>
  <p class="card-text">Humidity</p>
</div>`);
    },
  });
});

// News modal
document.getElementById("newsModal").addEventListener("click", () => {
  jQuery("#newsModal .modal-body").html(` <div class="card-body">
  <p class="card-text">Title</p>
  <p class="card-text">Source Name</p>

</div>`);
});
// currency modal
document.getElementById("currencyModal").addEventListener("click", () => {
  jQuery("#currencyModal .modal-body").html(` <div class="card-body">
  <p class="card-text">Currency Code</p>
  <p class="card-text">Currency Name</p>

</div>`);
});
// National Holidays
document.getElementById("nationalHolModal").addEventListener("click", () => {
  jQuery("#nationalHolModal .modal-body").html(`<div class="card-body">
  <h3 class="card-title"></h3>
  <p class="card-text">Name</p>
  <p class="card-text">Date</p>
  <p class="card-text">Weekday Name</p>


</div>`);
});

// Map display
const tileLayer = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 15,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
).addTo(map);
