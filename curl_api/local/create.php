<?php
session_start();
if (isset($_POST['name'])) {
// HUOMAA TAAS token osoitteen GET parametrina
$url = "http://localhost/curl_mvc/live/create.php?token=ABDSC144DSD";
$ch = curl_init();
$arr['name'] = $_POST['name'];
$arr['email'] = $_POST['email'];
$arr['phone'] = $_POST['phone'];
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $arr);
$result = curl_exec($ch);
curl_close($ch);
$result = json_decode($result, true);
if (isset($result['status']) && isset($result['code']) && $result['code'] == 10) {
$_SESSION['success_mg'] = $result['data'];
header('location:index.php');
die();
} else {
echo $result['data'];
}
} else {
header('location:index.php');
}
?>