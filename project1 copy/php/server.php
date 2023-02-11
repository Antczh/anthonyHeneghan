<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$countryCode = $_GET['c'];

$url = './countryBorders.geo.json';
$data = file_get_contents($url);
$decode = json_decode($data, true);

$url = 'http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $countryCode . '&username=antch';


$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['geonames'];
// get wikipedia
$capital = $output['data'][0]['capital'];

$url = 'http://api.geonames.org/wikipediaSearchJSON?formatted=true&q=' . $capital . '&maxRows=10&username=antch&style=full';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (isset($decode) && isset($decode['geonames']) && isset($decode['geonames'][0]) && isset($decode['geonames'][0]['wikipediaUrl'])) {
    $output['data'][0]['wiki'] = $decode['geonames'][0]['wikipediaUrl'];
} else {
    $output['data'][0]['wiki'] = "NA";
}
header('Content-Type: application/json; charset=UTF-8');

// lat lng API
$url = "https://restcountries.com/v3.1/alpha/" . $countryCode;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
$decode = json_decode($result, true);

$latlng = $decode[0]['latlng'];
curl_close($ch);


// weather API
$url = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $latlng[0] . '&lon=' . $latlng[1] . '&appid=2cc2e66eaabbee0304c1c626a25344bc';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);
$decode = json_decode($result, true);
$output['data'][0]['weather'] = $decode["weather"][0]["description"];
curl_close($ch);

echo json_encode($output);
