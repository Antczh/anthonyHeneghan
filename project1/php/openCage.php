<?php
// Set the OpenCage API key
$apiKey = '4ab907fcf8584274bc630ff7769a2037';

// Set the latitude and longitude coordinates
$latitude = $_POST['latitude'];
$longitude = $_POST['longitude'];

// Set the API endpoint URL
$url = "https://api.opencagedata.com/geocode/v1/json?q=" . $latitude . "," . $longitude . "&key=" . $apiKey . "&language=en&no_annotations=1&limit=1";

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
