<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    


<?php
$db_host = 'localhost';
$db_name = 'schooldb';
$db_username = 'root';
$db_password = '';


$dsn = "mysql:host=$db_host;dbname=$db_name";

try{
        $db_connection = new PDO($dsn, $db_username, $db_password);
}   catch(Exception $e) {
    echo "There was a failure - " . $e->getMessage();
}


?>
</body>
</html>