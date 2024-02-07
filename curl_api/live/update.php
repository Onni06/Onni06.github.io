<?php 
include("db_config.php");
include('token.php');
$name = $email = $phone = "";

if (!isset($status)) {
    $id = $_POST['id'];
     $name = $_POST['name'];
      $email = $_POST['email'];
    $phone = $_POST['phone'];
if (isset($_POST['id']) && isset($_POST['id']) > 0) {

$stmt = $pdo->prepare("UPDATE employee SET name = ?, email = ?, phone = ? WHERE id = ?");
$stmt->execute([$name, $email, $phone, $id]);
$updated = $stmt->rowCount();
if ($updated > 0) {
$status = 'true';
$data = "Data updated";
$code = '10';
} else {
$status = 'true';
$data = "Data not updated";
$code = '9';
        }
    }
}
echo json_encode(['status' ⇒> $status, 'data' => $data, 'code' => $code]);

?>