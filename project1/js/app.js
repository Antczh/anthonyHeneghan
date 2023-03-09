let countryList = [];
let geometry = [];
let coords = [];
let polygon = "";
let markerCountry = "";
let countryGeneralInfo = "";
let newsDataErr = "";

var cityIcons = L.ExtraMarkers.icon({
  icon: "fa-city",
  markerColor: "black",
  shape: "square",
  prefix: "fa",
});

var airportIcon = L.ExtraMarkers.icon({
  icon: "fa-plane",
  iconColor: "black",
  markerColor: "white",
  shape: "square",
  prefix: "fa",
});

$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(2000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

function getnearbyMajorCitties() {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/countryMajorCities.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      // console.log(res);
      let markers = L.markerClusterGroup({
        polygonOptions: {
          fillColor: "black",
          color: "#000",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5,
        },
      }).addTo(map);

      for (let i = 0; i < res.data.length; i++) {
        const cityLatLng = [res.data[i].lat, res.data[i].lng];

        let cityName = res.data[i].name;
        let population = res.data[i].population;
        // console.log("city Name", cityName);
        let nearbyCitiesMarker = L.marker(cityLatLng, {
          icon: cityIcons,
        });
        nearbyCitiesMarker.bindPopup(
          "<strong>" +
            cityName +
            "</strong>" +
            "<br><strong>Population:&nbsp;</strong>" +
            population.toLocaleString()
        );

        markers.addLayer(nearbyCitiesMarker);
        cityGroup.addLayer(markers);

        markers.addTo(map);
      }
      map.addLayer(markers);
    },
  });
}
// ${new Intl.NumberFormat("en-IN").format(population)};

function getAirports() {
  const countryCode = $("#country").val();

  $.ajax({
    url: "php/countryAirports.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      // console.log(res);

      let markers = L.markerClusterGroup({
        polygonOptions: {
          fillColor: "white",
          color: "#000",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.5,
        },
      }).addTo(map);
      for (let i = 0; i < res.data.length; i++) {
        const cityAirportLatLng = [res.data[i].lat, res.data[i].lng];

        let cityAirportName = res.data[i].name;

        // console.log("city Name", cityName);
        let nearbyAirportMarker = L.marker(cityAirportLatLng, {
          icon: airportIcon,
        });
        nearbyAirportMarker.bindPopup(cityAirportName);

        markers.addLayer(nearbyAirportMarker);
        airportGroup.addLayer(markers);

        markers.addTo(map);
      }
      map.addLayer(markers);
    },
  });
}

$.ajax({
  type: "GET",
  url: "php/request.php",
  dataType: "json",
  success: function (data) {
    // console.log(data);

    countryList = data.countries;

    countryList = countryList.sort(function (firstElement, secondElement) {
      return firstElement.name > secondElement.name ? 1 : -1;
    });
    countryList.forEach((item) => {
      $("#country").append(
        `<option id="countryId" value="${item.code}">${item.name}</option>`
      );
    });
    // console.log("requesting locaiton");
    navigator.geolocation.getCurrentPosition(success, error);
  },
  error: function (jqXHR, textStatus, errorThrown) {
    alert(errorThrown + " " + jqXHR + " " + textStatus);
  },
});

const map = L.map("map").setView([0, 0], 2);

// ------------------------------------reverse geocode inner function------------------------------------------------------------

function success(pos) {
  function reverseGeocode() {
    $.ajax({
      url: "php/openCage.php",
      method: "POST",
      dataType: "json",
      data: {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      },
      success: function (data) {
        // console.log("position", data);

        var geoCountryCode = data.results[0].components["ISO_3166-1_alpha-2"];
        // console.log(geoCountryCode);
        $("#country").val(geoCountryCode).trigger("change");
      },
      error: function (jqXHR, textStatus, errorThrown) {},
    });
  }
  // console.log(pos);

  const geoLatitude = pos.coords.latitude;
  const geoLongitude = pos.coords.longitude;

  reverseGeocode(geoLatitude, geoLongitude);
}
// ------------------------------------reverse geocode inner function------------------------------------------------------------
function error(err) {
  let errGeoCountry = "TH";
  $("#country").val(errGeoCountry).trigger("change");
  alert("Location denied, sending you to Thailand");
}

$("#country").on("change", function (event) {
  if (event.target.value) {
    const country = countryList.filter(
      (item) => item.code == event.target.value
    );

    $.ajax({
      url: "php/getLatLng.php?c=" + country[0].code,
      type: "GET",
      dataType: "json",
      success: function (res) {
        // console.log(res[0].latlng);
        map.setView(res[0].latlng, 6);
        if (markerCountry != "") {
          map.removeLayer(markerCountry);
        }

        $.ajax({
          url: "php/polygon.php?c=" + country[0].code,
          type: "GET",
          dataType: "json",
          success: function (res) {
            if (polygon != "") {
              map.removeLayer(polygon);
            }
            polygon = L.geoJSON(res, {
              style: function (feature) {
                return { color: "blue" };
              },
            }).bindPopup(function (layer) {
              return layer.feature.properties.geometry;
            });
            polygon.addTo(map);

            map.fitBounds(polygon.getBounds());
            // call functoins

            getnearbyMajorCitties();
            getAirports();
            generalCountryInfo();
            weatherForecast();
            newsInfo();
            currencyConverter();
            nationalHols();
          },
        });
      },
    });
  }
});

// General Info
function generalCountryInfo() {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/server.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      // console.log(res);
      let capital = res["data"][0].capital;
      let population = res["data"][0].population;
      let countryName = res["data"][0].countryName;
      let wikipedia = res["data"][0].wiki;

      countryGeneralInfo = `<table class="retrievedInfoTable">
      <tr>
        <td><strong>Country:</strong></td>
        <td id="countryName">&nbsp;&nbsp;&nbsp;${countryName}</td>
      </tr>
      <tr>
        <td><strong>Capital:</strong></td>
        <td id="capitalName">&nbsp;&nbsp;&nbsp;${capital}</td>
      </tr>
    
      <tr>
        <td><strong>Population:</strong></td>
        <td id="countryPopulation">&nbsp;&nbsp;&nbsp;${new Intl.NumberFormat(
          "en-IN"
        ).format(population)}</td>
      </tr>
      <tr>
    
      <tr>
        <td><strong>Wikipedia Link:</strong></td>
          <td id="wikiLinks"><a href="https://${wikipedia}">${wikipedia}</a></td>
      </tr>
    </table>`;
      jQuery("#maginfyBtn").removeAttr("disabled");
    },
  });
}
document.getElementById("maginfyBtn").addEventListener("click", () => {
  jQuery("#exampleModal .modal-body").html(countryGeneralInfo);
});

// Weather
function weatherForecast() {
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

      weatherInfo = `<div class="card-body">
      <p class="wethaerText"><strong>General Weather:</strong> ${
        description.charAt(0).toUpperCase() + description.slice(1)
      }</p>
   <div id="iconWeather"> <img src="http://openweathermap.org/img/wn/${
     data.icon
   }@2x.png" alt="Weather Icon Photo"></div>
   <div id="weatherTable">
  <table id="weatherTableContents">
  <tr>
  <td class="wethaerText"><strong>Temperature:</strong></td>
  <td class="wethaerText">&nbsp;&nbsp;&nbsp;${Math.round(temp)}&#8451;</td>
  </tr>

  <tr>
  <td class="wethaerText"><strong>Temperature Feels Like:</strong></td>
  <td class="wethaerText">&nbsp;&nbsp;&nbsp;${Math.round(feelsLike)}&#8451;</td>
  </tr>

  <tr>
  <td class="wethaerText"><strong>Max Temperature:</strong></td>
  <td class="wethaerText">&nbsp;&nbsp;&nbsp;${Math.round(tempMax)}&#8451;</td>
  </tr>

  <tr>
  <td class="wethaerText"><strong>Minimun Temperature:</strong></td>
  <td class="wethaerText">&nbsp;&nbsp;&nbsp;${Math.round(tempMin)}&#8451;</td>
  </tr>

  <tr>
  <td class="wethaerText"><strong>Humidity:</strong></td>
  <td class="wethaerText">&nbsp;&nbsp;&nbsp;${humidity}%</td>
  </tr>
  </table>
  </div>
</div>`;
      jQuery("#weatherModalBtn").removeAttr("disabled");
    },
  });
}
document.getElementById("weatherModalBtn").addEventListener("click", () => {
  jQuery("#weatherModal .modal-body").html(weatherInfo);
});

// News Modal

function newsInfo() {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/topNews.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      let newsData = "";

      if (data.status === "ERROR") {
        newsDataErr = "News not available for this country";
        jQuery("#newsModal .modal-body").html(newsDataErr);
        return;
      }
      // console.log(data);

      data.data.forEach((item) => {
        let date = item.published_datetime_utc;

        newsData += `<div class="newsCard">
        <img class="cardNewsImg" src="${
          item.photo_url
        }" alt="News Artcile Photo">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">${new Date(date).toUTCString()}</p>
          <a href="${item.link}" class="btn btn-primary">Article Link</a>
        </div>
      </div><br>`;
      });
      jQuery("#localNewsInfo").removeAttr("disabled");
      jQuery("#newsModal .modal-body").html(newsData);

      document.getElementById("localNewsInfo").addEventListener("click", () => {
        jQuery("#newsModal .modal-body").html(newsData);
      });
    },
  });
}

// Currency Modal
function currencyConverter() {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/currency.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      // console.log("money", res);

      let baseAmount = res.old_amount;
      let countryCurrency = res.new_currency;
      let targetCountryAmount = res.new_amount;

      currencyInfo = `<div class="card-body">
      <p class="card-text" id="currencyFirstP"><strong>Country Currency:</strong> ${countryCurrency}</p>
      <p class="card-text" id="currencySecondP"><strong>Conversion:</strong> ${baseAmount} USD = ${targetCountryAmount} ${countryCurrency} </p>
    </div>`;
      jQuery("#mnyBtn").removeAttr("disabled");
    },
  });
}
document.getElementById("mnyBtn").addEventListener("click", () => {
  jQuery("#currencyModal .modal-body").html(currencyInfo);
});

function nationalHols() {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/hols.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      let holsInfo = "";

      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        holsInfo += `<div class="card-body">
          <table class="table">
            <thead class="thead-dark">  
              <tr>
                <th colspan="1" "scope="col" class="holidayTitle">${item.name}</th>
                <th colspan="2" "scope="col" class="holidayDate">${item.date}</th>
              </tr>
            </thead>
          </table>
        </div>`;
      }
      jQuery("#nationalHolBtn2").removeAttr("disabled");
      jQuery("#nationalHolModal .modal-body").html(holsInfo);

      document
        .getElementById("nationalHolBtn2")
        .addEventListener("click", () => {
          jQuery("#nationalHolModal .modal-body").html(holsInfo);
        });
    },
  });
}

// Map display
const tileLayer = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 15,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
).addTo(map);

// -------------------------------------------layer controls----------------------------------------------
let cityGroup = L.layerGroup();
let airportGroup = L.layerGroup();

var overlays = {
  Cities: cityGroup,
  Airports: airportGroup,
};

var layerControl = L.control.layers(null, overlays).addTo(map);

// Add the Cities and Airports overlays to the map
cityGroup.addTo(map);
airportGroup.addTo(map);

// Set the Cities and Airports overlays to be initially selected
Object.keys(layerControl._layers).forEach(function (key) {
  var layer = layerControl._layers[key].layer;
  if (layer === cityGroup || layer === airportGroup) {
    layerControl._map.addLayer(layer);
  }
});

// Update the visibility of the city and airport layers when the layer control is changed
layerControl.on("add", function (event) {
  var layer = event.layer;
  if (layer === cityGroup || layer === airportGroup) {
    layer.eachLayer(function (marker) {
      marker.setStyle({ opacity: 1 });
    });
  }
});

layerControl.on("remove", function (event) {
  var layer = event.layer;
  if (layer === cityGroup || layer === airportGroup) {
    layer.eachLayer(function (marker) {
      marker.setStyle({ opacity: 0 });
    });
  }
});
// -------------------------------------------layer controls----------------------------------------------
