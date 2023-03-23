function loadEmployeeInfo(filter = "") {
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log(res);

      const personnelCard = $("#personnelCard");
      personnelCard.empty(); // Clear any existing cards before appending new ones

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

$(document).ready(function () {
  loadEmployeeInfo(); // Load all employee cards on page load

  // Listen for changes to the search bar and filter the results accordingly
  $("#searchBar").on("input", function () {
    const searchStr = $(this).val();
    loadEmployeeInfo(searchStr);
  });
});

function showAllDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log(res);
      const departmentCard = $("#departmentCard");

      departmentCard.empty(); // Clear any existing cards before appending new ones

      for (let i = 0; i < res.data.length; i++) {
        const item = res.data[i];
        const departmentName = item.name;

        const departmentinfo = `<div class="employeeCard card mb-3">
        <div class="row g-0">
          <div class="col-md-4">
          <div class="col-md-8">
            <div class="card-body">
              <h3 class="card-title">${departmentName}</h3>
            </div>
          </div>
        </div>
      </div>
    `;

        departmentCard.append(departmentinfo);
      }
    },
  });
}
$("#allDepartmentsOpt").click(function () {
  console.log("Departments option clicked...");
  showAllDepartments();
});
