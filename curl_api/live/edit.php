<?php
include("db_config.php");
include('token.php');
$id = $_POST['id'];
if (!isset($status)) {
    if (isset($_POST['id']) && isset($_POST['id']) > 0) {
//$sqlRes = mysqli_query($conn, "SELECT * FROM employee WHERE id='$id'"); 
$stmt = $pdo->prepare("SELECT * FROM employee WHERE id=?");
$stmt->execute([$id]);
$row = $stmt->fetch(PDO:: FETCH_ASSOC);
if ($row) {
$data=[];
$data[] = $row;


$status = 'true';
$code = '5';
} else {
$status = 'true';
$data = "Data Not found";
$code = '4';
        }
    }
}
echo $result = json_encode(['status' => $status, 'data' => $data, 'code' => $code]);
?>