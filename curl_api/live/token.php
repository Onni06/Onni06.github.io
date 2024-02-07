<?php
include('db_config.php');
header('Content-Type:application/json');

if(isset($_GET['token'])) {
    $token = $_GET['token'];
    $stmt = $pdo->prepare('select * from api_tokens WHERE token = ?');
    $stmt->execute([$token]);
    $token = $stmt->fetch();
    if ($token) {
        if ($token['status'] == 1) {
        } else {
            $status = 'true';
            $data = "API token deactivated";
            $code = '3';
        }
    } else {
        $status = 'true';
        $data = "Please provide valid API token";
        $code = '2';
    }

} else {
    $status = 'true';
    $data = "Please provide valid API token";
    $code = '1';
}
//echo json_encode(['status'=>$status, 'data'=>$data, 'code' => $code]);
?>