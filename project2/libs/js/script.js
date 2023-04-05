const personnelCard = $("#personnelCard");
const departmentCard = $("#departmentCard");
const locationCard = $("#locationCard");

$(document).ready(function () {
  loadEmployeeInfo();
});

$("#homeBtn").click(function () {
  location.reload();
});

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
                <button class="btn btn-warning" id="cardEdit">Edit</button>
                <button class="btn btn-danger" id="cardDelete">Delete</button>

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

$("#searchBar").on("input", function () {
  $(".card").hide();
  const searchStr = $(this).val();
  loadEmployeeInfo(searchStr);
});

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
                <button class="btn btn-warning" id="cardEdit">Edit</button>
                <button class="btn btn-danger" id="cardDelete">Delete</button>
                
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
  event.preventDefault();
  $(".card").hide();
  filterOptions();
});

function addPersonal() {
  $.ajax({
    url: "libs/php/addPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: $("#addFirstName").val(),
      lastName: $("#addLastName").val(),
      email: $("#addEmail").val(),
      jobTitle: $("#addJobTitle").val(),
      departmentID: $("#addDepSelect").val(),
    },
    success: function (res) {
      console.log("added personnel", res);

      location.reload();
    },
  });
}
$("#addPersonnelSave").click(function (event) {
  addPersonal();
});

function deletePersonnel() {
  var userID = $("#user_id").val();
  $.ajax({
    url: "libs/php/deletePersonnel.php",
    type: "GET",
    dataType: "json",
    data: {
      id: userID,
    },
    success: function (res) {
      console.log("deleted personnel", res);
      location.reload();
    },
  });
}
$("#cardDelete").click(function (event) {
  console.log("delete clicked", personnelDelete);
  deletePersonnel();
});

function insertNewDep() {
  $.ajax({
    url: "libs/php/addDepartment.php",
    type: "GET",
    dataType: "json",
    data: {
      name: $("#addDepName").val(),
      locationID: $("#addlocationSelect").val(),
    },
    success: function (res) {
      location.reload();
      console.log(res);
    },
  });
}
$("#addDepSave").click(function (event) {
  console.log("addDepSave clicked", addDepSave);
  insertNewDep();
});
// move dep and location to their own pages new html doc
//
