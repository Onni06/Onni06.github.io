<?php 
include('token.php');
$stmt = $pdo->query('SELECT * FROM employee', PDO::FETCH_ASSOC);
if (!isset($status)) {
if($stmt) {
    $data = [];
    foreach ($stmt as $row)
    {
        $data[] = $row;
    }
    $status = 'true';
    $code = '5';
} else {
    $status = 'true';
    $data = "Data Not found";
    $code = '4';
    }
}
echo $result = json_encode(['status' => $status, 'data' => $data, 'code' => $code]);

?>