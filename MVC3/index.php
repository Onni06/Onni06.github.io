<?php
/*
*based on request type, choose appropriate action
* no method (default): list
* POST & action=add:         add new
* POST & action=update:      update
* GET & action=edit:         edit
* GET & action=delete:       delete
*/
require_once("View.php");
require_once("Model.php");


switch($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        if(isset($_GET['action'])) {
            $action = $_GET['action'];
            if($action == 'edit') {
                $id = $_GET['id'];
                require_once("db_config.php");
                $stmt = $pdo->prepare("SELECT * from kayttaja WHERE kayttajaid=?");
                $stmt->execute([$id]);
                $row = $stmt->fetch();
                $kayttaja = new Kayttaja($row['kayttajaid'], $row['etunimi'], $row['sukunimi']);
                $view = new View();
                $view->editPage($kayttaja);
            } else if($action == 'delete') {
                $id = $_GET['id'];
                require_once("db_config.php");
                $stmt = $pdo->prepare("DELETE FROM kayttaja WHERE kayttajaid=?");
                $stmt->execute([$id]);
                $deleted = $stmt->rowCount();
                if( $deleted == 1) {
                    header("location: index.php");
                } else {
                    echo "virhe";
                }
            } else if($action == 'add') {
                $view = new View();
                $view->newPage();
            } else {
                
            }
        } else{
            require_once("db_config.php");
                $stmt = $pdo->query('SELECT * FROM kayttaja');
                $kayttajat = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $view = new View();
                $view->showAll($kayttajat);
        }
        break;

    case 'POST':
        if(isset($_POST['action'])) {
            $action = $_POST['action'];
            if($action == 'add') {
                $etunimi = $_POST['fname'];
                $sukunimi = $_POST['sname'];
                require_once("db_config.php");
                $stmt = $pdo->prepare("INSERT INTO kayttaja(etunimi,sukunimi)
                VALUES(?,?)");
                $stmt->execute([$etunimi,$sukunimi]);
                $added = $stmt->rowCount();
                if($added == 1) {
                    header("Location: index.php");

                } else {
                    echo "virhe";
                }
                
            } else if($action == 'update') {
                $id = $_POST['id'];
                $etunimi = $_POST['fname'];
                $sukunimi = $_POST['sname'];
                require_once("db_config.php");
                $stmt = $pdo->prepare("UPDATE kayttaja SET etunimi = ?, sukunimi = ?
                 WHERE kayttajaid = ?");
                 $stmt->execute([$etunimi, $sukunimi, $id]);
                 $updated = $stmt->rowCount();
                 if($updated == 1) {
                     header("Location: index.php");
 
                 } else {
                     echo "virhe";
                 }
            }
        }
        break;

    default:
        
        
}
?>
