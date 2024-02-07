<?php
include('db_config.php');
include('token.php');

if (!isset($status)) {
$id = $_POST['id'];

if (isset($_POST['id']) && isset($_POST['id']) > 0) {
    $stmt = $pdo->prepare("DELETE FROM employee WHERE id = ?");
    $stmt->execute([$id]);
    $deleted = $stmt->rowCount();
    if ($deleted > 0) {
        $status = 'true';
        $data = "Data deleted";
        $code = '10';
    } else {
        $status = 'true';
        $data = "Data not deleted";
        $code = '7';

    }
} else {
    $status = 'true';
    $data = "provide id";
    $code = '6';

}
}
echo json_encode(['status' => $status, 'data' => $data, 'code' => $code]);
?>