// function loadEmployeeInfo() {
//   $.ajax({
//     url: "libs/php/getAll.php",
//     type: "GET",
//     dataType: "json",
//     success: function (res) {
//       console.log(res);

//       const personnelCard = $("#personnelCard");

//       let employeeInfo = "";

//       for (let i = 0; i < res.data.length; i++) {
//         const item = res.data[i];
//         const employeeFirstName = item.firstName;
//         const employeeLastName = item.lastName;
//         const employeeEmail = item.email;
//         const employeeDepartment = item.department;
//         const employeeLocation = item.location;

//         employeeInfo += `<div class="employeeCard card mb-3">
//             <div class="row g-0">
//               <div class="col-md-4">
//                 <img
//                   src="./fontawesome-free-6.3.0-web/svgs/solid/id-badge-solid.svg"
//                   class="img-fluid rounded-start"
//                   alt="Personnel Profile Photo"
//                 />
//               </div>
//               <div class="col-md-8">
//                 <div class="card-body">
//                   <h3 class="card-title" id="personnelName">${employeeFirstName} ${employeeLastName}</h3>
//                   <h6 id="personnelEmail">${employeeEmail}</h6>
//                   <h6 id="personnelDepartment">${employeeDepartment}</h6>
//                   <h6 id="personnelLocation">${employeeLocation}</h6>
//                 </div>
//               </div>
//             </div>
//           </div>
//         `;
//       }

//       personnelCard.append(employeeInfo);
//     },
//   });
// }

function loadEmployeeInfo() {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log(res);

      const personnelCard = $("#personnelCard");

      personnelCard.empty(); // Clear any existing cards before appending new ones

      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i];
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
      }
    },
  });
}

$(document).ready(function () {
  loadEmployeeInfo();
});

$("#homeBtn").click(function () {
  console.log("home button clicked...");
  loadEmployeeInfo();
});

$(document).ready(function () {
  loadEmployeeInfo();
});

$("#homeBtn").click(function () {
  console.log("home button clicked...");
  loadEmployeeInfo();
});

const dropdownItems = document.querySelectorAll(".dropdown-item");

dropdownItems.forEach((item) => {
  item.addEventListener("click", () => {
    const selectedOption = item.textContent;
    console.log(`Selected option: ${selectedOption}`);
    // Do something with the selected option
  });
});

// function showAllDepartments() {
//   $.ajax({
//     url: "libs/php/getAllDepartments.php",
//     type: "GET",
//     dataType: "json",
//     success: function (res) {
//       console.log(res);
//       const departmentCard = $("#departmentCard");

//       let employeeInfo = "";

//       for (let i = 0; i < res.data.length; i++) {
//         const item = res.data[i];
//         const employeeFirstName = item.firstName;
//         const employeeLastName = item.lastName;
//         const employeeEmail = item.email;
//         const employeeDepartment = item.department;
//         const employeeLocation = item.location;

//         employeeInfo += `<div class="employeeCard card mb-3">
//             <div class="row g-0">
//               <div class="col-md-4">
//                 <img
//                   src="./fontawesome-free-6.3.0-web/svgs/solid/id-badge-solid.svg"
//                   class="img-fluid rounded-start"
//                   alt="Personnel Profile Photo"
//                 />
//               </div>
//               <div class="col-md-8">
//                 <div class="card-body">
//                   <h3 class="card-title" id="personnelName">${employeeFirstName} ${employeeLastName}</h3>
//                   <h6 id="personnelEmail">${employeeEmail}</h6>
//                   <h6 id="personnelDepartment">${employeeDepartment}</h6>
//                   <h6 id="personnelLocation">${employeeLocation}</h6>
//                 </div>
//               </div>
//             </div>
//           </div>
//         `;
//       }
//     },
//   });
// }
// $("#allDepartmentsOpt").click(function () {
//   console.log("Departments option clicked...");
//   showAllDepartments();
// });
