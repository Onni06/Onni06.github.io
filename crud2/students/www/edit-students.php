<?php
require_once('../db_config.php');
$id = $_GET['id'];
$query = "SELECT * FROM students WHERE studentID = :studentID LIMIT 1";
$result = $db_connection->prepare($query);
$result->execute([
    'studentID' => $id
]);
$result = $result->fetch();
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
    <form method="post" action="update-students.php">
    <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">studentID</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="studentID" name="studentID" value="<?php echo $result['studentID'] 
                ?>"> 
    </div>
    </div>
    
    <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">firstName</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="firstName" name="firstName" 
                value="<?php echo $result['firstName'] ?>"> 
    </div>
    </div>
    
    <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">lastName</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="lastName" name="lastName" 
                value="<?php echo $result['lastName'] ?>"> 
    </div>
    </div>

    <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">dateOfBirth</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="dateOfBirth" name="dateOfBirth" 
                value="<?php echo $result['dateOfBirth'] ?>"> 
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
                if ($result1['classID'] == $result['class']){
    ?>
     <option name="class" id="class" selected value="<?php echo $result1['classID']; ?>"><?php echo $result1['className']; ?></option>
            <?php
           } else{
                ?>
                <option name="class" id="class" value="<?php echo $result1['classID']; ?>"><?php echo $result1['className']; ?></option>
                <?php
            }
      }
    
      ?>
    </select>
        </div>
    </div>
    
    <button type="submit" name="updateRecord" class="btn btn-success">Update</button>
    </form>
    </div>
</body>
</html>