<?php
session_start();
if (isset($_POST['name'])) {
$url = "http://localhost/curl_api/live/update.php?token=ABDSC144DSD";
$ch = curl_init();
$arr['id'] = $_POST['id'];
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
header('Location:index.php');
$_SESSION['success_mg'] = $result['data'];
die();
} else {
echo $result['data'];
}
} else {
header('Location:index.php');
}
?>