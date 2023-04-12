$(document).ready(function () {
  loadAllLocations();
});

function loadAllLocations() {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log("location cards", res);

      const locationCard = $("#locationCard");
      locationCard.empty();

      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i];
        const locationName = item.name;

        const locationInfo = `<div class="col-sm-4 mb-3">
                <div class="card">
                  <div class="card-body">
                    <h5 class="card-title">${locationName}</h5>
                    <button class="btn btn-warning cardEdit" 
                    type="button" 
                    class="btn btn-primary" 
                    data-bs-toggle="modal" 
                    data-bs-target="#editLocationModal" 
                    data-id="${item.id}"
                    onclick="populateLocationNameEdit({
                      'editLocationName': '${locationName}',
                      'editLocationId': '${item.id}'
                    })">
                    Edit
                    </button>


                    <button class="btn btn-danger" 
                    type="button" 
                    data-bs-toggle="modal" 
                    data-bs-target="#deleteLocationModal" 
                    data-id="${item.id}"
                    onclick="document.getElementById('deleteLocationModal').setAttribute('data-id','${item.id}')">
                    Delete
                    </button>                  
                    </div>
                </div>
              </div>
            `;

        locationCard.append(locationInfo);
      }
      locationCard.append(locationCard.append());
    },
  });
}

function editLocationName() {
  $.ajax({
    url: "",
    type: "",
    dataType: "",
    success: function (res) {
      console.log(res);
    },
  });
}

function deleteLocation(locationId) {
  $.ajax({
    url: "libs/php/deleteLocation.php?id=" + locationId,
    type: "DELETE",
    dataType: "json",
    success: function (res) {
      console.log(res);
      location.reload();
    },
  });
}

$("#deleteLocationYes").click(function (event) {
  const locationId = document
    .getElementById("deleteLocationModal")
    .getAttribute("data-id");
  console.log("ID value:", locationId);
  deleteLocation(locationId);
});

function populateLocationNameEdit(data) {
  Object.keys(data).forEach(function (elementId) {
    document.getElementById(elementId).value = data[elementId];
  });
}
