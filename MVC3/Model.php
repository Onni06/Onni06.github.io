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
class Kayttaja
{
    private $kayttajaid;
    private $etunimi;
    private $sukunimi;

    public function __construct($kayttajaid = NULL, $etunimi = "", $sukunimi = "") {
        $this->kayttajaid = $kayttajaid;
        $this->etunimi = $etunimi;
        $this->sukunimi = $sukunimi;
    }
    public function get_kayttajaid() {
        return $this->kayttajaid;
    }

    public function set_kayttajaid($kayttajaid) {
        $this->kayttajaid = $kayttajaid;
    }

    public function get_etunimi() {
        return $this->etunimi;
    }
   
    public function set_etunimi($etunimi) {
        $this->etunimi = $etunimi;
    }

    public function get_sukunimi() {
        return $this->sukunimi;
    }
    
    public function set_sukunimi($sukunimi) {
        $this->sukunimi = $sukunimi;
    }

}
    

    
?>

</body>
</html>