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

              <button class="btn btn-warning cardEdit"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#editPersonnelModal"
              data-id="${item.id}"
              onclick="populateEdit({
              'editPersonnelId': '${item.id}',
              'editFirstName': '${item.firstName}',
              'editLastName': '${item.lastName}',
              'editEmail': '${item.email}',
              'editJobTitle': '${item.jobTitle}',
              'editDepSelect': '${item.departmentId}'
              });">
              Edit
              </button>

        <button class="btn btn-danger cardDelete" 
        type="button" 
        class="btn btn-primary" 
        data-bs-toggle="modal" 
        data-bs-target="#deleteModal"data-id="${item.id}" onclick="document.getElementById('deleteModal').setAttribute('data-id','${item.id}')">Delete</button>
      </div>
    </div>
  </div>
`;

        personnelCard.append(employeeCardHTML);
      });
    },
    error: function (xhr, status, error) {},
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
    type: "POST",
    data: { department_id: departmentId, location_id: locationId },
    dataType: "json",
    success: function (res) {
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

                <button class="btn btn-warning cardEdit"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#editPersonnelModal"
                data-id="${item.id}"
                onclick="populateEdit({
                'editPersonnelId': '${item.id}',
                'editFirstName': '${item.firstName}',
                'editLastName': '${item.lastName}',
                'editEmail': '${item.email}',
                'editJobTitle': '${item.jobTitle}',
                'editDepSelect': '${item.departmentId}'
                });">
                Edit
                </button>

                <button 
                class="btn btn-danger" 
                type="button" 
                data-bs-toggle="modal" 
                data-bs-target="#deleteModal"data-id="${item.id}" 
                onclick="document.getElementById('deleteModal').setAttribute('data-id','${item.id}')">Delete</button>
                                
              </div>
            </div>
          </div>
        `;

        filteredCard.append(employeeCard);
      });
    },
    error: function (xhr, status, error) {},
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
      location.reload();
    },
  });
}
$("#addPersonnelSave").click(function (event) {
  addPersonal();
});

function addNewDep() {
  $.ajax({
    url: "libs/php/addDepartment.php",
    type: "POST",
    dataType: "json",
    data: {
      name: $("#addDepName").val(),
      locationID: $("#addlocationSelect").val(),
    },
    success: function (res) {
      location.reload();
    },
  });
}
$("#addDepSave").click(function (event) {
  addNewDep();
});

function addLocation() {
  $.ajax({
    url: "libs/php/addLocation.php",
    type: "POST",
    dataType: "json",
    data: {
      name: $("#addNewLocationName").val(),
    },
    success: function (res) {
      location.reload();
    },
  });
}
$("#addLocationSave").click(function (event) {
  addLocation();
});
// -------------------------------------------------------------------------------------------
function deletePersonnel(deletePersonnelId) {
  $.ajax({
    url: "libs/php/deletePersonnel.php?id=" + deletePersonnelId,
    type: "DELETE",
    dataType: "json",
    success: function (res) {
      location.reload();
    },
  });
}

$("#deleteYes").click(function (event) {
  const deletePersonnelId = document
    .getElementById("deleteModal")
    .getAttribute("data-id");
  deletePersonnel(deletePersonnelId);
});

// -------------------------------------------------------------------------------------------

function editPersonnel() {
  $.ajax({
    url: "libs/php/editedPersonnel.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: $("#editFirstName").val(),
      lastName: $("#editLastName").val(),
      email: $("#editEmail").val(),
      jobTitle: $("#editJobTitle").val(),
      departmentID: $("#editDepSelect").val(),
      id: $("#editPersonnelId").val(),
    },
    success: function (res) {
      location.reload();
    },
  });
}

$("#editPersonnelSave").click(function (event) {
  editPersonnel();
});
// $("#editPersonnelModal").click(function (event) {});

function populateEdit(data) {
  Object.keys(data).forEach(function (elementId) {
    document.getElementById(elementId).value = data[elementId];
  });
}
