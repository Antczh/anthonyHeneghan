<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$countryCode = $_GET['c'];

$url = './countryBorders.geo.json';
$data = file_get_contents($url);
$decode = json_decode($data, true);

$url = 'http://api.geonames.org/countryInfoJSON?formatted=true&country=' . $countryCode . '&username=antch';


$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://hot-breaking-news-latest-news.p.rapidapi.com/exec?id=country-" . $countryCode . "&numberOfRow=5&pageNumber=1&sortBy=hot",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: hot-breaking-news-latest-news.p.rapidapi.com",
        "X-RapidAPI-Key: 450da59770msh48f578fe4ec52bcp1e3255jsn924835a58ab7"
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

// $curl = curl_init();

// curl_setopt_array($curl, [
//     CURLOPT_URL => "https://locale-news.p.rapidapi.com/news?region=" . $countryCode . "&lang=en",
//     CURLOPT_RETURNTRANSFER => true,
//     CURLOPT_FOLLOWLOCATION => true,
//     CURLOPT_ENCODING => "",
//     CURLOPT_MAXREDIRS => 10,
//     CURLOPT_TIMEOUT => 30,
//     CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//     CURLOPT_CUSTOMREQUEST => "GET",
//     CURLOPT_HTTPHEADER => [
//         "X-RapidAPI-Host: locale-news.p.rapidapi.com",
//         "X-RapidAPI-Key: 450da59770msh48f578fe4ec52bcp1e3255jsn924835a58ab7"
//     ],
// ]);

// $response = curl_exec($curl);
// $err = curl_error($curl);

// curl_close($curl);

// if ($err) {
//     echo "cURL Error #:" . $err;
// } else {
//     echo $response;
// }
