let countryList = [];
let geometry = [];
let coords = [];
let polygon = "";
let markerCountry = "";
let mapIcon = L.icon({
  iconUrl: "./fontawesome-free-6.2.1-web/svgs/icons/map-pin-solid.svg",
  iconSize: [48, 48], // size of the icon
  iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -48], // point from which the popup should open relative to the iconAnchor
});
let nearbyCityIcon = L.icon({
  iconUrl: "./fontawesome-free-6.2.1-web/svgs/icons/city-solid.svg",
  iconSize: [48, 48], // size of the icon
  iconAnchor: [24, 48], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -48], // point from which the popup should open relative to the iconAnchor
});

let natureIcon = L.icon({
  iconUrl: "./fontawesome-free-6.2.1-web/svgs/icons/tree-solid.svg",
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
  latitudeAfghanistan = 33.9391;
  lngAfghanistan = 67.71;
  marker = L.marker([latitudeAfghanistan, lngAfghanistan], { icon: mapIcon });
  marker.addTo(map).bindPopup("We have placed you here!").openPopup();
  map.setView([latitudeAfghanistan, lngAfghanistan], 10);
  // if (err.code === 1) {
  //   alert("Please allow location access");
  // } else {
  //   alert("Cannot get location");
  // }
}

window.addEventListener("load", (event) => {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "denied") {
      document.getElementById("country").value = "AF";
    }
    // console.log(result.state);
  });
});

$.ajax({
  type: "GET",
  url: "php/request.php",
  dataType: "json",
  success: function (data) {
    countryList = data.data.features;
    // console.log("before sorting ", countryList);
    countryList = countryList.sort(function (firstElement, secondElement) {
      return firstElement.properties.name > secondElement.properties.name
        ? 1
        : -1;
    });
    // console.log("after sorting ", countryList);
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
        markerCountry = L.marker(res[0].latlng, { icon: mapIcon });
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

        $.ajax({
          url: "php/nearbyCities.php?c=" + country[0].properties.iso_a2,
          type: "GET",
          dataType: "json",
          success: function (res) {
            if (country[0].properties.iso_a2 == res) {
              var markers = L.markerClusterGroup();
              markers.addLayer(L.marker(res.cities.latitude.longitude(map)));
              map.addLayer(markers);
            }
            // console.log("result ", res);
          },
        });
      },
    });
  }
});

document.getElementById("maginfyBtn").addEventListener("click", () => {
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
    <td>Wikipedia Link:</td>
      <td id="wikiLinks"><a href="https://${wikipedia}">${wikipedia}</a></td>
  </tr>
</table>`);
    },
  });
});

document.getElementById("weatherModalBtn").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/openWeather.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function ({ data }) {
      // console.log(data);
      let description = data.description;
      let temp = data.temp;
      let feelsLike = data.feels_like;
      let tempMax = data.temp_max;
      let tempMin = data.temp_min;
      let humidity = data.humidity;

      jQuery("#weatherModal .modal-body").html(` <div class="card-body">
      <p class="card-text">General Weather: ${description}</p>
  <img src="http://openweathermap.org/img/wn/${data.icon}@2x.png">
  <p class="card-text">Temperature: ${Math.round(temp)}&#8451;</p>
  <p class="card-text">Temperature feels like: ${Math.round(
    feelsLike
  )}&#8451;</p>
  <p class="card-text">Max Temperature: ${Math.round(tempMax)}&#8451;</p>
  <p class="card-text">Minimun Temperature: ${Math.round(tempMin)}&#8451;</p>
  <p class="card-text">Humidity: ${humidity}%</p>
</div>`);
    },
  });
});

// News Modal
document.getElementById("newsModal").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/topNews.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (data) {
      let title = data.data[0].title;
      let url = data.data[0].link;
      let sourceName = data.data[0].source_url;

      console.log("news ", data);
      jQuery("#newsModal .modal-body").html(` <div class="card-body">
      <p class="card-text">Title: ${title}</p>
      <p class="card-text">Source: <a href="https://${sourceName}">${sourceName}</a></p>
      <p class="card-text">Link: <a href="https://${url}">${url}</a></p>
    </div>`);
    },
  });
});

// Currency Modal
document.getElementById("currencyModal").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/currency.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log("money", res);

      let baseCurrency = res.old_currency;
      let baseAmount = res.old_amount;
      let countryCurrency = res.new_currency;
      let targetCountryAmount = res.new_amount;

      jQuery("#currencyModal .modal-body").html(` <div class="card-body">
      <p class="card-text">Base Currency: ${baseCurrency}</p>
      <p class="card-text">Country Currency: ${countryCurrency}</p>
      <p class="card-text">Conversion: ${baseAmount} USD = ${targetCountryAmount} ${countryCurrency} </p>


    </div>`);
    },
  });
});
// National Holidays
document.getElementById("nationalHolModal").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/hols.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      // console.log("holidays", res);
      let name = res[0].name;
      let date = res[0].date;
      let type = res[0].type;

      jQuery("#nationalHolModal .modal-body").html(`<div class="card-body">
      <h3 class="card-title"></h3>
      <p class="card-text">Name: ${name}<br>Date: ${date}<br>Holiday Type: ${type}</p>
    </div>`);
    },
  });
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
