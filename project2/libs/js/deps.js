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
                    <button class="btn btn-warning cardEdit" 
                    type="button" 
                    data-bs-toggle="modal" 
                    data-bs-target="#editDepModal" 
                    data-id="${item.id}" 
                    onclick="populateDepNameEdit({
                      'editDepName': '${departmentName}'
                    })">Edit
                    </button>

                    <button class="btn btn-danger cardDelete" 
                    type="button" 
                    data-bs-toggle="modal" 
                    data-bs-target="#deleteDepModal" 
                    data-id="${item.id}" 
                    onclick="document.getElementById('deleteDepModal').setAttribute('data-id','${item.id}')">Delete</button>
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

function deleteDep(deleteDepartmentId) {
  $.ajax({
    url: "libs/php/deleteDep.php?id=" + deleteDepartmentId,
    type: "DELETE",
    dataType: "json",
    success: function (res) {
      console.log("deleted dep", res);
      location.reload();
    },
  });
}

$("#deleteDepYes").click(function (event) {
  const deleteDepartmentId = document
    .getElementById("deleteDepModal")
    .getAttribute("data-id");
  // console.log("ID value:", departmentId);
  deleteDep(deleteDepartmentId);
});

// ---------------------------------------------------------------------------------------
function submitEditDepName() {
  $.ajax({
    url: "libs/php/editDep.php",
    type: "POST",
    dataType: "json",
    data: {
      name: $("#editDepName").val(),
    },
    success: function (res) {
      console.log(res);
      location.reload();
    },
  });
}

$("#editDepSave").click(function (event) {
  // const editDepName = document.getElementById("editDepName").value;
  // console.log("Department name:", editDepName);
  submitEditDepName();
});

function populateDepNameEdit(data) {
  Object.keys(data).forEach(function (elementId) {
    document.getElementById("editDepName").value = data[elementId];
  });
}
