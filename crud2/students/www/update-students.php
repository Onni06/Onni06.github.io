<?php
require_once('../db_config.php');

if(isset($_POST['updateRecord'])) {
    $id = filter_var($_POST['studentID'], FILTER_SANITIZE_NUMBER_INT);
    $firstName = filter_var($_POST['firstName'], FILTER_UNSAFE_RAW);
    $lastName = filter_var($_POST['lastName'], FILTER_UNSAFE_RAW );
    $dateOfBirth = filter_var($_POST['dateOfBirth'], FILTER_SANITIZE_NUMBER_INT);
    $class = filter_var($_POST['class'], FILTER_SANITIZE_NUMBER_INT);
    $query = "UPDATE students SET firstName=:firstName, lastName=:lastName, dateOfBirth=:dateOfBirth, class=:class
    WHERE studentID=:studentID";
                    $result = $db_connection->prepare($query);
                    $result->execute([
                        'firstName' => $firstName,
                        'lastName' => $lastName,
                        'dateOfBirth' => $dateOfBirth,
                        'class' => $class,
                        'studentID' => $id,
                    ]);
                    $rows = $result->rowCount();
                    if ($rows == 1) {
                        header('Location: list-students.php');
                    } else {
                        $error_message = "Updating record failed";
            
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
    <br>
    <div class="container">
        <?php
        if(isset($error_message)) {
            ?>
        <div class="alert alert-success">
            <strong>Error!</strong>
            <?php echo $error_message; ?>
        </div>
        <?php
    
        }
        ?>
        </div>
</body>
</html>