<?php
require_once('../db_config.php');


if(isset($_POST['createRecord'])) {
   
    $firstName = filter_var($_POST['firstName'], FILTER_UNSAFE_RAW);
    $lastName = filter_var($_POST['lastName'], FILTER_UNSAFE_RAW);
    $dateOfBirth = filter_var($_POST['dateOfBirth'], FILTER_SANITIZE_NUMBER_INT);
    $class = filter_var($_POST['class'], FILTER_SANITIZE_NUMBER_INT);
   
   $query = "INSERT INTO students(firstName, lastName, dateOfBirth, class)
                    VALUES (:firstName, :lastName, :dateOfBirth, :class)";
                    $result = $db_connection->prepare($query);
                    $result->execute([
                        'firstName' => $firstName,
                        'lastName' => $lastName,
                        'dateOfBirth' => $dateOfBirth,
                        'class' => $class,
                    ]);
                    $rows = $result->rowCount();
                    if ($rows == 1) {
                        header('Location: list-students.php');
                    } else {
                        $error_message = "Record creation failed";
            
                    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.1.0/css/all.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</head>
<body>
<nav class="navbar navbar-expand-sm bg-primary navbar-dark">
  <div class="container-fluid">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link active" href="http://localhost/phpkoodit1/crud2/students/www/list-students.php">Students</a>
      </li>
     <li class="nav-item">
        <a class="nav-link active" href="http://localhost/phpkoodit1/crud2/classes/www/list-classes.php">Classes</a>
      </li>
      
    </ul>
  </div>
</nav>
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
      <form method="POST" action="">
        <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">firstName</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="firstName" name="firstName">
    </div>
    </div>
    <div class="form-group row">
            <label for="author" class="col-sm-2 col-form-label">lastName</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="lastName" name="lastName">
    </div>
    </div>
    <div class="form-group row">
            <label for="genre" class="col-sm-2 col-form-label">dateOfBirth</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="dateOfBirth" name="dateOfBirth">
    </div>
    </div>
    <div class="form-group row">
    <label for="height" class="col-sm-2 col-form-label">class</label>
            <div class="col-sm-10">
            <select class="form-select" name="class">
       <?php
        $query1 = "SELECT * FROM classes";
        $result2 = $db_connection->query($query1);

             foreach($result2 as $result1) {
    ?>
     <option name="class" id="class" value="<?php echo $result1['classID']; ?>"><?php echo $result1['className']; ?></option>
            <?php
      }
    
      ?>
    </select>
        </div>
    </div>
    
    <button type="submit" name="createRecord" class="btn btn-success">add Class</button>
    </form>
    </div>
      
      
      
</body>
</html>