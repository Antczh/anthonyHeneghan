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
                    <a href="#" class="btn btn-warning">Edit</a> <a href="#" class="btn btn-danger">Delete</a>
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
