$(document).ready(function () {
  loadAllDepartments();
});

function loadAllDepartments() {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (res) {
      console.log("dep cards", res);

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
