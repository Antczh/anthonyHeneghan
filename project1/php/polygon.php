<?php

$url = './countryBorders.geo.json';
// echo ($url);
$data = file_get_contents($url);
$decode = json_decode($data, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";

$countryCode = $_GET['c'];


$searchedCountry = NULL;
foreach ($decode['features'] as $feature) {
    if ($feature['properties']['iso_a2'] == $countryCode) {
        $searchedCountry = $feature;
    }
}


echo json_encode($searchedCountry);
