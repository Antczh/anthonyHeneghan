<?php
$key = 'fcb99439-a44d-48d5-b412-a7d34cb34a8e';
$holiday_api = new \HolidayAPI\Client(['key' => $key]);
$holidays = $holiday_api->holidays([
    'country' => 'GB',
    'year' => '2022',
]);
// https://holidayapi.com/docs