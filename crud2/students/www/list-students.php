<?php 
require_once('../db_config.php');
$query = "SELECT * FROM students INNER JOIN classes
ON students.class = classes.classID";
$results = $db_connection->query($query);
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
<div class="container">
        <h1 class="display-1 text-center">Students</h1>
        <a href="add-students.php" class="btn btn-info">add Student</a>
        <table class="table">
            <thead>
                <tr>
                    
                    <th>firstName</th>
                    <th>lastName</th>
                    <th>dateOfBirth</th>
                    <th>class</th>
                </tr>
            </thead>
            <tbody>
    <?php 
    foreach ($results as $result) {
        ?>
   <tr>
       
        <td>
            <?php echo $result['firstName']?>
        </td>

        <td>
            <?php echo $result['lastName']?>
        </td>

        <td>
            <?php echo $result['dateOfBirth']?>
        </td>

        <td>
            <?php echo $result['className']?>
        </td>
        
        
        <td><a href="edit-students.php?id=<?php echo $result['studentID'] ?>"><i class="fas fa-edit"></i>
    </a></td>

        <td><a href="delete-students.php?id=<?php echo $result['studentID'] ?>"><i class="fas fa-trash-alt"></i></a></td>
    </tr>
    <?php
    

        }

    ?>
    </tbody>
    </table>
    </div>

</body>
</html>