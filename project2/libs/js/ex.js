function loadEmployeeInfo() { $.ajax({ url: "libs/php/getAll.php", type: "GET",
dataType: "json", success: function (res) { console.log(res); // Select the
container element where the cards will be appended const personnelCard =
$("#personnelCard"); let employeeInfo = ""; // Loop through the response data
and create a card for each employee for (let i = 0; i < res.data.length; i++) {
const item = res.data[i]; const employeeFirstName = item.firstName; const
employeeLastName = item.lastName; const employeeEmail = item.email; const
employeeDepartment = item.department; const employeeLocation = item.location; //
Create the HTML markup for the card employeeInfo += `
<div class="card mb-3" style="max-width: 450px">
  <div class="row g-0">
    <div class="col-md-4">
      <img
        src="./fontawesome-free-6.3.0-web/svgs/solid/id-badge-solid.svg"
        class="img-fluid rounded-start"
        alt="Personnel Profile Photo"
      />
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h3 class="card-title" id="personnelName">
          ${employeeFirstName} ${employeeLastName}
        </h3>
        <h5 id="personnelEmail">${employeeEmail}</h5>
        <h5 id="personnelDepartment">${employeeDepartment}</h5>
        <h5 id="personnelLocation">${employeeLocation}</h5>
      </div>
    </div>
  </div>
</div>
`; // Append the card to the container element
personnelCard.append(employeeInfo); } }, }); } $("#homeBtn").click(function () {
console.log("home button clicked..."); loadEmployeeInfo(); });
