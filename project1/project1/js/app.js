let countryList = [];
let geometry = [];
let coords = [];
let polygon = "";
let markerCountry = "";
const map = L.map("map").setView([0, 0], 2);

navigator.geolocation.getCurrentPosition(success, error);
let marker;

function success(pos) {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  marker = L.marker([lat, lng]);
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
// Map display
const tileLayer = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 15,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
).addTo(map);
