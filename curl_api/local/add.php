<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit-no">
<title>PHP API CRUD opearation</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto | Varela+Round | Open+Sans">
 <link rel="stylesheet"href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-
awesome.min.css">
</head>
<body>
<div class="container">
<div class="table-responsive">
<div class="table-wrapper">
<div class="table-title">
<div class="row">
<div class="col-sm-8">
<h2>Add New <b>Employee</b></h2>
</div>
</div>
</div>
<form action="create.php" method="POST" id="myform">
<div class="form-group">
<label>Name</label>
<input type="text" name="name" class="form-control">
</div>
<div class="form-group">
<label>Email</label>
<input type="text" name="email" class="form-control">
</div>
<div class="form-group">
<label>Phone</label>
<input type="text" name="phone" class="form-control">
</div>
<button type="submit" name="submit" class="btn btn-primary">Save</button>
</form>
</div>
</div>
</div>
</body>
</html>