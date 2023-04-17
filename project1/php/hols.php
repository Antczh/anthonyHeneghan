<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$countryCode = $_GET['c'];


$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => "https://public-holiday.p.rapidapi.com/2023/" . $countryCode . "",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "X-RapidAPI-Host: public-holiday.p.rapidapi.com",
        "X-RapidAPI-Key: $rapid_key"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "Information not available" . $err;
} else {
    echo $response;
}
