<?php
$url = './countryBorders.geo.json';
// echo ($url);
$data = file_get_contents($url);

echo $data;
