<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$countryCode = $_GET['c'];

$url = "https://restcountries.com/v3.1/alpha/" . $countryCode;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
$decode = json_decode($result, true);

$latlng = $decode[0]['latlng'];
curl_close($ch);

$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://countries-cities.p.rapidapi.com/location/city/nearby?latitude=' . $latlng[0] . '&longitude=' . $latlng[1] .'&radius=25&min_population=99&max_population=10000&per_page=10",
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
