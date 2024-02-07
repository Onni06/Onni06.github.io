<?php
require_once('../db_config.php');
if(!isset($_GET['id'])) {
    header('Location: list-classes.php');
    die();
} else {
    $id = filter_var($_GET['id'], FILTER_SANITIZE_NUMBER_INT);
    if (!$id) {
        header('Location: list-classes.php');
        die();
    } else {
        $query = "DELETE FROM classes
                WHERE classID = :classID LIMIT 1";
                $result = $db_connection->prepare($query);
                $result->execute([
                    'classID' => $id
                ]);
                $rowsdeleted = $result->rowCount();
                if($rowsdeleted == 1) {
                    header("Location: list-classes.php");
                } else {
                    $error_message = "Record was not deleted";
                }
    }
}


?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.1.0/css/all.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <title>Document</title>
</head>
<body>
    <div class="container">
        <?php
        if (isset($error_message)) {
            ?>
            <div class="alert alert-danger">
                <strong>Error!</strong>
                <?php echo $error_message; ?> Go back to <a href="list-classes.php" class="alert-link">list of classes</a>
        </div>
        <?php
        }
        ?>
        </div>
</body>
</html>