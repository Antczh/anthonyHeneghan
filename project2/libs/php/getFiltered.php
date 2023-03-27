<?php

// example use from browser
// http://localhost/companydirectory/libs/php/getAll.php

// remove next two lines for production

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

	$output['status']['code'] = "300";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "database unavailable";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;
}

// SQL does not accept parameters and so is not prepared
$query_string = "SELECT p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ";

if (isset($_REQUEST["department_id"]) && isset($_REQUEST["location_id"])) {
	$query_string .= "WHERE d.id = ? AND l.id = ? ";
} elseif (isset($_REQUEST["department_id"])) {
	$query_string .= "WHERE d.id = ? ";
} elseif (isset($_REQUEST["location_id"])) {
	$query_string .= "WHERE l.id = ? ";
}

$query_string .= "ORDER BY p.lastName, p.firstName, d.name, l.name";

$query = $conn->prepare($query_string);

if (isset($_REQUEST["department_id"]) && isset($_REQUEST["location_id"])) {
	$query->bind_param("ii", $_REQUEST['department_id'], $_REQUEST['location_id']);
} elseif (isset($_REQUEST["department_id"])) {
	$query->bind_param("i", $_REQUEST['department_id']);
} elseif (isset($_REQUEST["location_id"])) {
	$query->bind_param("i", $_REQUEST['location_id']);
}



$query->execute();

if (false === $query) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	echo json_encode($output);

	mysqli_close($conn);
	exit;
}

$result = $query->get_result();


$data = [];

while ($row = mysqli_fetch_assoc($result)) {

	array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output);
