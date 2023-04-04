const personnelCard = $("#personnelCard");
const departmentCard = $("#departmentCard");
const locationCard = $("#locationCard");

function loadEmployeeInfo(filter = "") {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log("all personnel", res);
      personnelCard.empty();
      locationCard.empty();
      const filteredData = res.data.filter((item) =>
        `${item.firstName} ${item.lastName} ${item.email} ${item.department} ${item.location}`
          .toLowerCase()
          .includes(filter.toLowerCase())
      );

      filteredData.forEach((item) => {
        const employeeFirstName = item.firstName;
        const employeeLastName = item.lastName;
        const employeeEmail = item.email;
        const employeeDepartment = item.department;
        const employeeLocation = item.location;

        const employeeCardHTML = `
          <div class="col-sm-4 mb-3">
            <div class="card">
              <div class="card-body">
              <img src="./fontawesome-free-6.3.0-web/svgs/solid/id-badge-solid.svg" class="img-fluid rounded-start" alt="Personnel Profile Photo" style="width: 100px; height: 140px;" />

                <h5 class="card-title">${employeeFirstName} ${employeeLastName}</h5>
                <p class="card-text">${employeeEmail}</p>
                <p class="card-text"> ${employeeDepartment}</p>
                <p class="card-text"> ${employeeLocation}</p>
                <a href="#" class="btn btn-warning">Edit</a> <a href="#" class="btn btn-danger">Delete</a>

              </div>
            </div>
          </div>
        `;

        personnelCard.append(employeeCardHTML);
      });
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

$(document).ready(function () {
  loadEmployeeInfo();
});

$("#homeBtn").click(function () {
  location.reload();
});

$("#searchBar").on("input", function () {
  $(".card").hide();
  const searchStr = $(this).val();
  loadEmployeeInfo(searchStr);
});

function loadAllDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log("dep cards", res);
      personnelCard.empty();
      // locationCard.empty();

      const departmentCard = $("#departmentCard");
      departmentCard.empty();

      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i];
        const departmentName = item.name;

        const departmentinfo = `<div class="col-sm-4 mb-3">
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${departmentName}</h5>
                  <a href="#" class="btn btn-warning">Edit</a> <a href="#" class="btn btn-danger">Delete</a>
                </div>
              </div>
            </div>
          `;

        departmentCard.append(departmentinfo);
      }
      departmentCard.append(departmentCard.append());
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}
// --------------------------------------------------------------------------------------------------------------
function loadAllLocations() {
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log("location cards", res);

      personnelCard.empty();
      departmentCard.empty();

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

function filterOptions() {
  let departmentId = document.getElementById("depSelect").value;
  let locationId = document.getElementById("locationSelect").value;

  $.ajax({
    url: "libs/php/getFiltered.php?",
    type: "GET",
    data: { department_id: departmentId, location_id: locationId },
    dataType: "json",
    success: function (res) {
      console.log(res);

      const filteredCard = $("#filteredCard");

      filteredCard.empty();
      personnelCard.empty();

      const filteredData = res.data.filter(
        (item) =>
          `${item.firstName} ${item.lastName} ${item.email} ${item.department} ${item.location}`
      );

      filteredData.forEach((item) => {
        const employeeFirstName = item.firstName;
        const employeeLastName = item.lastName;
        const employeeEmail = item.email;
        const employeeDepartment = item.department;
        const employeeLocation = item.location;

        const employeeCard = `
          <div class="col-sm-4 mb-3">
            <div class="card">
              <div class="card-body">
              <img src="./fontawesome-free-6.3.0-web/svgs/solid/id-badge-solid.svg" class="img-fluid rounded-start" alt="Personnel Profile Photo" style="width: 100px; height: 140px;" />

                <h5 class="card-title">${employeeFirstName} ${employeeLastName}</h5>
                <p class="card-text">${employeeEmail}</p>
                <p class="card-text"> ${employeeDepartment}</p>
                <p class="card-text"> ${employeeLocation}</p>
                <a href="#" class="btn btn-warning">Edit</a> <a href="#" class="btn btn-danger">Delete</a>

              </div>
            </div>
          </div>
        `;

        filteredCard.append(employeeCard);
      });
    },
    error: function (xhr, status, error) {
      console.log(error);
    },
  });
}

$("#searchBtn").click(function (event) {
  event.preventDefault(); // prevent the default form submission behavior
  $(".card").hide();
  filterOptions();
});

function insertNewDep() {
  $.ajax({
    url: "libs/php/insertDepartment.php",
    type: "POST",
    data: "json",
    success: function (res) {
      console.log(res);
    },
  });
}

// move dep and location to their own pages new html doc
//
