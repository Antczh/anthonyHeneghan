<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);
$executionStartTime = microtime(true);
$countryCode = $_GET['c'];


$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://real-time-news-data.p.rapidapi.com/top-headlines?country=" . $countryCode . "&lang=",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: real-time-news-data.p.rapidapi.com",
        "X-RapidAPI-Key: 450da59770msh48f578fe4ec52bcp1e3255jsn924835a58ab7"
    ],
]);


$response = (curl_exec($curl));
echo $response;
