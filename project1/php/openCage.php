<?php

$latitude = 25.0343;
$longitude = 77.3963;
$apiKey = ' 4ab907fcf8584274bc630ff7769a2037';

$url = "https://api.opencagedata.com/geocode/v1/json?q={$latitude}+{$longitude}&key={$apiKey}";

$response = file_get_contents($url);

echo $response;
