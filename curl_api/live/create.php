<?php
include('db_config.php');
include('token.php');
$name = $email = $phone = "";
if (!isset($status)) {
$name = $_POST['name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
if (isset($_POST['name'])) {
    $stmt = $pdo->prepare("INSERT INTO employee (name, email, phone) VALUES (?, ?, ?)");
    $stmt->execute([$name, $email, $phone]);
    $inserted = $stmt->rowCount();
    if ($inserted > 0) {
        $status = 'true';
        $data = "Data inserted";
        $code = '10';
    } else {
        $status = 'true';
        $data = "Data not inserted";
        $code = '9';

    }
}
}
echo json_encode(['status' => $status, 'data' => $data, 'code' => $code]);
?>