<?php

// the first two lines provide error reporting when the routine is called from a browser, eg:

// http://api.geonames.org/searchJSON?formatted=true&q=airport&country=GB&maxRows=30&lang=es&username=antch&style=full

// remove or comment them out once you are sure that the routine is stable.

ini_set('display_errors', 'On');
error_reporting(E_ALL);

// set the return header

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$executionStartTime = microtime(true);

// $_REQUEST is used initially because it accepts parameters passed as both $_POST and $_GET
// (for when the routine is called directly from the browser as per the example above).
// Replace with $_POST once you are sure that the routine is stable.
$countryCode = $_GET['c'];

$url = 'http://api.geonames.org/searchJSON?q=airport&country=' . $countryCode . '&maxRows=30&lang=en&username=antch';

$ch = curl_init();

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

$cURLERROR = curl_errno($ch);

curl_close($ch);

if ($cURLERROR) {

    $output['status']['code'] = $cURLERROR;
    $output['status']['name'] = "Failure - cURL";
    $output['status']['description'] = curl_strerror($cURLERROR);
    $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
    $output['data'] = null;
} else {

    // serialise the cURL result to an associative array so that it can be
    // tested for valid content before it is appended to the output array

    $airports = json_decode($result, true);

    if (json_last_error() !== JSON_ERROR_NONE) {

        $output['status']['code'] = json_last_error();
        $output['status']['name'] = "Failure - JSON";
        $output['status']['description'] = json_last_error_msg();
        $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
        $output['data'] = null;
    } else {

        // has the api returned an error?

        if (isset($airports['status'])) {

            $output['status']['code'] = $airports['status']['value'];
            $output['status']['name'] = "Failure - API";
            $output['status']['description'] = $airports['error']['message'];
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            $output['data'] = null;
        } else {

            // create array containing only the required properties

            // the API supports HTTPS and so the icon URLs are amended
            // to ensure that there are no CROSS ORIGIN errors in the client

            $finalResult = [];

            foreach ($airports['geonames'] as $item) {

                $temp['name'] = $item['name'];
                $temp['lat'] = $item['lat'];
                $temp['lng'] = $item['lng'];

                array_push($finalResult, $temp);
            }

            $output['status']['code'] = 200;
            $output['status']['name'] = "success";
            $output['status']['description'] = "all ok";
            $output['status']['seconds'] = number_format((microtime(true) - $executionStartTime), 3);
            // $output['data'] = $airports;
            $output['data'] = $finalResult;
        }
    }
}

echo json_encode($output, JSON_NUMERIC_CHECK);
