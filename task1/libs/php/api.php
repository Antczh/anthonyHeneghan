<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    $timezoneUrl =
    "http://api.geonames.org/timezoneJSON";

  $weatherUrl =
    "http://api.geonames.org/weatherJSON?north=68&south=-45&east=-80&west=100&username=antch";
  
  $oceanNameUrl =
    "http://api.geonames.org/oceanJSON";


    if ( $_REQUEST['api'] && $_REQUEST['api'] == "timezone" ) {
        $url= $timezoneUrl . "?". "lat=" .  $_REQUEST['lat'] . "&lng=" .  $_REQUEST['lng']  . "&username=antch";
    } elseif ( $_REQUEST['api'] && $_REQUEST['api'] == "ocean" ) { 
		$url= $oceanNameUrl . "?". "lat=" .  $_REQUEST['lat'] . "&lng=" .  $_REQUEST['lng']  . "&username=antch";
    }

	// $url='http://api.geonames.org/weatherJSON?north=68&south=-45&east=-80&west=100&username=antch';

	// Ocean Code
	
   
       // $url='http://api.geonames.org/weatherJSON?north=68&south=-45&east=-80&west=100&username=antch';


	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 