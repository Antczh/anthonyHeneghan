function loadEmployeeInfo(filter = "") {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      // console.log(res);

      const personnelCard = $("#personnelCard");
      personnelCard.empty();

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
  });
}
$("#personnelTab").click(function () {
  $(".card").hide();

  loadEmployeeInfo();
});
$(document).ready(function () {
  loadEmployeeInfo();

  $("#searchBar").on("input", function () {
    $(".card").hide();
    const searchStr = $(this).val();
    loadEmployeeInfo(searchStr);
  });
});

$("#homeBtn").click(function () {
  location.reload();
});

let departmentId = "";
let locationId = "";
function filterOptions() {
  $.ajax({
    url: "libs/php/getFiltered.php?",
    type: "GET",
    data: { department_id: departmentId, location_id: locationId },
    dataType: "json",
    success: function (res) {
      console.log(res);

      const filteredCard = $("#filteredCard");
      const personnelCard = $("#personnelCard");

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

$("#searchBtn").click(function () {
  $(".card").hide();
  filterOptions();
  // showAllDepartments();
});

$("#depTab").click(function () {
  // console.log(departmentTab);
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      $(".card").hide();
      const personnelCard = $("#personnelCard");
      personnelCard.empty();

      console.log(res);

      const departmentCard = $("#departmentCard");
      // departmentCard.empty();

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
    },
    error: function (xhr, status, error) {
      console.error("Error fetching departments:", error);
    },
  });
});

// $("#locationTab").click(function () {
//   $.ajax({
//     url: "libs/php/getAllDepartments.php",
//     type: "GET",
//     dataType: "json",
//     success: function (res) {
//       const departmentCard = $("#departmentCard");
//       departmentCard.empty();

//       for (let i = 0; i < res.data.length; i++) {
//         const item = res.data[i];
//         const departmentName = item.name;

//         const departmentinfo = `<div class="col-sm-4 mb-3">
//             <div class="card">
//               <div class="card-body">
//                 <h5 class="card-title">${departmentName}</h5>
//                 <a href="#" class="btn btn-warning">Edit</a> <a href="#" class="btn btn-danger">Delete</a>
//               </div>
//             </div>
//           </div>
//         `;

//         departmentCard.append(departmentinfo);
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error("Error fetching departments:", error);
//     },
//   });
// });
// $("#departmentTab").ready("click", function showAllDepartments() {
//   $.ajax({
//     url: "libs/php/getAllDepartments.php",
//     type: "GET",
//     dataType: "json",
//     success: function (res) {
//       // const personnelCard = $("#personnelCard");
//       const departmentCard = $("#departmentCard");

//       // personnelCard.hide();
//       departmentCard.empty();

//       for (let i = 0; i < res.data.length; i++) {
//         const item = res.data[i];
//         const departmentName = item.name;

//         const departmentinfo = `<div class="col-sm-4 mb-3">
//             <div class="card">
//               <div class="card-body">
//                 <h5 class="card-title">${departmentName}</h5>
//                 <a href="#" class="btn btn-warning">Edit</a> <a href="#" class="btn btn-danger">Delete</a>
//               </div>
//             </div>
//           </div>
//         `;

//         departmentCard.append(departmentinfo);
//       }
//     },
//     error: function (xhr, status, error) {
//       console.error("Error fetching departments:", error);
//     },
//   });
// });

// function addNewDepartment() {}
