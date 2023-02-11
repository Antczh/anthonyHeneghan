<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);

$countryCode = $_GET['c'];
$url = './countryBorders.geo.json';
$data = file_get_contents($url);
$decode = json_decode($data, true);

$executionStartTime = microtime(true);
$countryCode = $_GET['c'];
$key = 'fcb99439-a44d-48d5-b412-a7d34cb34a8e';

$url = 'https://holidayapi.com/v1/holidays?pretty&' . $key . '&country=' . $countryCode . '&year=2022';


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
$output['data'] = $decode['holidays'];
// https://holidayapi.com/docs
// fcb99439-a44d-48d5-b412-a7d34cb34a8e