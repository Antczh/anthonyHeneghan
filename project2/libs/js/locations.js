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
                    <button class="btn btn-warning cardEdit" ype="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="${item.id}">Edit</button>
                    <button class="btn btn-danger cardDelete" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#deleteLocationModal"data-id="${item.id}">Delete</button>                  </div>
                </div>
              </div>
            `;

        locationCard.append(locationInfo);
      }
      locationCard.append(locationCard.append());
    },
  });
}
