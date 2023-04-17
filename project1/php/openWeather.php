<?php
require_once 'config.php';

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$countryCode = $_GET['c'];

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
// exit;

// open weather 
$url = 'https://api.openweathermap.org/data/2.5/weather?lat=' . $latlng[0] . '&lon=' . $latlng[1] . '&appid=' . $weather_key . '&units=metric';
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);
$result = curl_exec($ch);
$decode = json_decode($result, true);

$main = $decode["main"];
$weather = $decode["weather"][0];
$output['data'] = array_merge($main, $weather);

// var_dump($output);

curl_close($ch);
echo json_encode($output);
