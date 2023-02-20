<?php
$url = './countryBorders.geo.json';
// echo ($url);
$data = file_get_contents($url);

echo $data;
// get country code from url like get latlng.php
// loop thorugh countries from json file like request.php
// loop need if statement need to checks if code matches
// get geometry data 
// in js 