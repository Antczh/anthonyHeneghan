<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$countryCode = $_GET['c'];
// $url = './countryBorders.geo.json';

// $data = file_get_contents($url);
// $decode = json_decode($data, true);
// country code
// $url = 'http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $countryCode . '&username=antch';



// lat lng 
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
    CURLOPT_URL => "https://travel-places.p.rapidapi.com/",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => "{\"query\":\"{ getPlaces(categories:[\\\"NATURE\\\"],lat:" . $latlng[0] . ",lng:" . $latlng[1] . ",maxDistMeters:50000) { name,lat,lng,abstract,distance,categories } }\"}",
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: travel-places.p.rapidapi.com",
        "X-RapidAPI-Key: 450da59770msh48f578fe4ec52bcp1e3255jsn924835a58ab7",
        "content-type: application/json"
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
