<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$countryCode = $_GET['c'];
$url = './countryBorders.geo.json';

$data = file_get_contents($url);
$decode = json_decode($data, true);
// country code
$url = 'http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $countryCode . '&username=antch';


$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => 'https://countries-cities.p.rapidapi.com/location/country/' . $countryCode . '/city/list?page=2&per_page=30&population=15000',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: countries-cities.p.rapidapi.com",
        "X-RapidAPI-Key: 1dc59fcc2dmshc115744fe59288fp1d3e1cjsnf486e618a03d"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo $response;
}
