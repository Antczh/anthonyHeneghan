<?php
require_once 'config.php';

// if (isset($_POST['latitude']) && isset($_POST['longitude'])) {
//     $latitude = $_POST['latitude'];
//     $longitude = $_POST['longitude'];
// } else {
//     echo json_encode(['error' => 'Latitude and/or longitude missing']);
//     exit();
// }

$apiKey = $opencage_key;



$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

// if (isset($latitude[$_POST['latitude']])) {
//     return $latitude = $_POST['latitude'];
// } elseif (isset($latitude[$_POST['longitude']])) {
//     $latitude = $_POST['longitude'];
// } else {
//     return;
// }

$url = "https://api.opencagedata.com/geocode/v1/json?q=" . $latitude . "+" . $longitude . "&key=" . $apiKey;

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

if (curl_error($ch)) {
    echo 'Error: ' . curl_error($ch);
    exit();
}

curl_close($ch);

$data = json_decode($response, true);

echo json_encode($data);
