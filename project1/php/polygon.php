<?php
$url = './countryBorders.geo.json';
// echo ($url);
$data = file_get_contents($url);
$decode = json_decode($data, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";

$countryCode = $_GET['c'];
// if(code == geometry) {

// }

// $countries = [];

// foreach ($decode["features"] as $feature) {
//     $country = [
//         "name" => $feature["properties"]["name"],
//         "code" => $feature["properties"]["iso_a2"]
//     ];
//     $countries[] = $country;
// }
// $output['countries'] = $countries;


$searchedCountry = NULL;
foreach ($decode['features'] as $feature) {
    if ($feature['properties']['iso_a2'] == $countryCode) {
        $searchedCountry = $feature;
    }
}

// foreach ($decode['features'] as $feature) {

//     $country_geometry = [
//         "code" => $feature['properties']['iso_a2'],
//         "geometry" => $feature['geometry']['coordinates'],
//     ];
//     $country_geometries[] = $country_geometry;
// }

// $output['country_geometries'] = $country_geometries;

echo json_encode($searchedCountry);

// ---------------------------------------------instructions--------------------------------------
// get country code from url like get latlng.php
// loop thorugh countries from json file like request.php
// loop need if statement need to checks if code matches
// get geometry data 
// in js 

// ---------------------------------------------instructions--------------------------------------







// -----------------------------------This works-----------------------------------------------
// $country_geometries = [];
// foreach ($decode['features'] as $feature) {
//     $country_code = $feature['properties']['iso_a2'];
//     $country_geometry = $feature['geometry']['coordinates'];
//     $country_geometries[$country_code] = $country_geometry;
// }

// $output['country_geometries'] = $country_geometries;

// -----------------------------------This works-----------------------------------------------
