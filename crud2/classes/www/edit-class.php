<?php
require_once('../db_config.php');
$id = $_GET['id'];
$query = "SELECT * FROM classes WHERE classID = :classID LIMIT 1";
$result = $db_connection->prepare($query);
$result->execute([
    'classID' => $id
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
    <form method="post" action="update-class.php">
    <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">classID</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="classID" name="classID" value="<?php echo $result['classID'] 
                ?>"> 
    </div>
    </div>
    
    <div class="form-group row">
            <label for="title" class="col-sm-2 col-form-label">Luokan nimi</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="className" name="className" 
                value="<?php echo $result['className'] ?>"> 
    </div>
    </div>
    
    
    <button type="submit" name="updateRecord" class="btn btn-success">Update Record</button>
    </form>
    </div>
</body>
</html>