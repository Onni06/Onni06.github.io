<?php
session_start();
// HUOMAA että oikea token on lisätty osoitteen GET parametriksi 
$url = "http://localhost/curl_api/live/index.php?token=ABDSC144DSD"; 
//$url = "https://www.google.co.in/";
$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, $url);

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
curl_close($ch);
$result = json_decode($result, true);
?>
<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>PHP API CRUD operation - bootstrapfriendly</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans">
 <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css"> 
 <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
 <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
</head>
<body><div class="container">
    <div class="table-responsive">
         <div class="table-wrapper">
     <div class="table-title">New</a>
     <div class="row"><div class="col-md-12">
        <div class="alert alert-success alert-dismissible fade show" role="alert"> 
            <?php if (isset($_SESSION['success_mg'])) {
                echo $_SESSION['success_mg'];
                } ?>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                 <span aria-hidden="true"></span>
        </button>
    </div>
</div>
    <div class="col-sm-8">
        <h2>Employee <b>Details</b></h2>
</div>
<div class="col-sm-4">
    <a href="add.php" class="btn btn-primary add-new float-end"> <i class="fa fa-plus"></i> Add 
        New </a>
    </div>
    </div>
</div> 
    <?php
    if (isset($result['status']) && isset($result['code']) && isset($result['code']) == 5) {
        
        ?><form action="" method="POST" id="myform">
        
        <table class="table table-bordered">
            <thead>
             <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
            </tr>
            </thead> 
            <tbody>
                
            <?php foreach ($result['data'] as $list) {
                ?>
                <tr>
                    <td><?php echo $list['name'] ?></td>
                    <td><?php echo $list['email'] ?></td>
                    <td><?php echo $list['phone'] ?></td>
                    <td>
                    <a href="edit.php?id=<?php echo $list['id'] ?>" class="edit" title="Edit" data- toggle="tooltip"><i class="material-icons"></i></a>
                            <a href="delete.php?id=<?php echo $list['id'] ?>" class="delete" title="Delete" data-toggle="tooltip"><i class="material-icons"></i></a>
                        </td> 
                    </tr>
                    
                    <?php
                } ?>
                
            
            </tbody>
        </table>
    </form>
    
    <?php
} else {
    //echo $result['data'];
    }
    ?>
    </div>
</div>
</div>
</body>

</html>