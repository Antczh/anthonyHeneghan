<?php
$url = './countryBorders.geo.json';
// echo ($url);
$data = file_get_contents($url);
$decode = json_decode($data, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
// $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

echo json_encode($output);
