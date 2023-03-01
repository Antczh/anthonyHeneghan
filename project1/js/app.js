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

var cityIcon = L.divIcon({
  className: "my-div-icon",
  html: '<img src="fontawesome-free-6.2.1-web/svgs/icons/city-solid.svg">',
  iconSize: [28, 28],
  popupAnchor: [0, -30],
  iconAnchor: [14, 28],
});

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
    console.log("requesting locaiton");
    navigator.geolocation.getCurrentPosition(success, error);
  },
  error: function (jqXHR, textStatus, errorThrown) {
    alert(errorThrown + " " + jqXHR + " " + textStatus);
  },
});

const map = L.map("map").setView([0, 0], 2);

// ----------------------------------my current onload locaiton----------------------------------------------------------------------

let marker = false;
// --------------------------------------------work-in-progress-----------------------------------------------------------------

function success(pos) {
  function reverseGeocode(latitude, longitude) {
    $.ajax({
      url: "php/openCage.php",
      method: "POST",
      dataType: "json",
      data: {
        q: latitude + "," + longitude,
      },
      success: function (data) {
        var geoCountryCode = data.results[0].components.country_code;
        console.log(geoCountryCode);
        $("#country").val(geoCountryCode).trigger("change");
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // console.log(textStatus, errorThrown);
      },
    });
  }

  console.log("position coords", pos);
  const latitude = pos.coords.latitude;
  const longitude = pos.coords.longitude;

  reverseGeocode(latitude, longitude);
}

function error(err) {
  let errGeoCountry = "TH";
  $("#country").val(errGeoCountry).trigger("change");
  alert("Location denied, sending you to Thailand");
}
// --------------------------------------------work-in-progress-----------------------------------------------------------------

// ----------------------------------my current onload locaiton----------------------------------------------------------------------

$("#country").on("change", function (event) {
  if (marker != false) {
    // map.removeLayer(marker);
  }
  console.log("dropdown changed");

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
        markerCountry = L.marker(res[0].latlng, { icon: mapIcon });
        markerCountry.addTo(map).bindPopup("You have arrived!").openPopup();

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
                return { color: "red" };
              },
            }).bindPopup(function (layer) {
              return layer.feature.properties.geometry;
            });
            polygon.addTo(map);

            map.fitBounds(polygon.getBounds());
          },
        });

        $.ajax({
          url: "php/nearbyCities.php?c=" + country[0].code,
          type: "GET",
          dataType: "json",
          success: function (res) {
            // console.log("cities ", res);
            let markers = L.markerClusterGroup();

            for (let i = 0; i < res.cities.length; i++) {
              const cityLatLng = [
                res.cities[i].latitude,
                res.cities[i].longitude,
              ];

              let cityName = res.cities[i].name;

              // console.log("city Name", cityName);
              let nearbyCitiesMarker = L.marker(cityLatLng, { icon: cityIcon });
              nearbyCitiesMarker.bindPopup("This is " + cityName);

              markers.addLayer(nearbyCitiesMarker);
              markers.addTo(map);
            }
            map.addLayer(markers);
          },
        });
      },
    });
  }
});

// General Info
document.getElementById("maginfyBtn").addEventListener("click", () => {
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

      jQuery("#exampleModal .modal-body")
        .html(`<table class="retrievedInfoTable">
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
</table>`);
    },
  });
});

// Weather
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
</div>`);
    },
  });
});

// News Modal
document.getElementById("localNewsInfo").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/topNews.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (data) {
      let html = "";

      if (data.status === "ERROR") {
        html = "News not available for this country";

        jQuery("#newsModal .modal-body").html(html);

        return;
      }
      // console.log(data);

      data.data.forEach((item) => {
        let date = item.published_datetime_utc;

        html += `<div class="newsCard">
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
      jQuery("#newsModal .modal-body").html(html);
    },
  });
});

// Currency Modal
document.getElementById("mnyBtn").addEventListener("click", () => {
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

      jQuery("#currencyModal .modal-body").html(` <div class="card-body">
      <p class="card-text" id="currencyFirstP"><strong>Country Currency:</strong> ${countryCurrency}</p>
      <p class="card-text" id="currencySecondP"><strong>Conversion:</strong> ${baseAmount} USD = ${targetCountryAmount} ${countryCurrency} </p>
    </div>`);
    },
  });
});

// National Holidays modal
document.getElementById("nationalHolBtn2").addEventListener("click", () => {
  const countryCode = $("#country").val();
  $.ajax({
    url: "php/hols.php?c=" + countryCode,
    type: "GET",
    dataType: "json",
    success: function (res) {
      let html = "";

      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        html += `<div class="card-body">
  <table class="table">
  <thead class="thead-dark">  
    <tr>
      <th colspan="1" "scope="col" class="holidayTitle">Holiday Name</th>
      <th colspan="2" "scope="col" class="holidayDate">Date</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="holidayNameAPI">${item.name}</td>
      <td class="holidayDateAPI">${item.date}</td>
    </tr>
  </tbody>
</table>
</table>`;
      }

      jQuery("#nationalHolModal .modal-body").html(html);
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
