<?php

class View
{ 
public function newPage()
{
include_once("header.html");

?>
<form action="index.php" method="POST">
<div class="mb-3 mt-3">
<label for="fname" class="form-label">Etunimi:</label>
<input type="text" class="form-control" id="fname" placeholder="Kayttajan etunimi"
name="fname">
</div>
<div class="mb-3">
<label for="sname" class="form-label">Sukunimi:</label>
<input type="text" class="form-control" id="sname" placeholder="Kayttajan sukunimi"
name="sname">
</div>
<button type="submit" name="action" value="add" class="btn btn-primary">Tallenna</button>
</form>
<?php
include_once("footer.html");
}

public function showAll($kayttajat) {
include_once("header.html");
?>
<a href="index.php?action=add">Lisää uusi</a>
<table class="table">
<tr><td>ID</td><td>Etunimi</td><td>Sukunimi</td><td>Muokkaa</td><td>Poista</td></tr>
<?php
foreach ($kayttajat as $kayttaja)
{
echo "<tr><td>". $kayttaja['kayttajaid'] . "</td><td>" . $kayttaja['etunimi'] . "</td>

<td>". $kayttaja['sukunimi'] . "</td>";
echo "<td><a href='index.php?action=edit&id=" . $kayttaja["kayttajaid"] .
"'>Muokkaa</a></td><td><a href='index.php?action=delete&id=" . $kayttaja["kayttajaid"] . "'>Poista</a>
</td></tr>";
}

?>
</table>
<?php
include_once("footer.html");
}
public function editPage($kayttaja) {
include_once("header.html");
?>
<form action="index.php" method="POST">
<input type="hidden" name="id"
value="<?php echo $kayttaja->get_kayttajaid(); ?>">
<div class="mb-3 mt-3">
<label for="fname" class="form-label">Etunimi:</label>
<input type="text" class="form-control" id="fname" placeholder="Kayttajan etunimi"
name="fname"
value="<?php echo $kayttaja->get_etunimi(); ?>">
</div>
<div class="mb-3">
<label for="sname" class="form-label">Sukunimi:</lLabel>
<input type="text" class="form-control" id="sname" placeholder="Kayttajan sukunimi"
name="sname"
value="<?php echo $kayttaja->get_sukunimi(); ?>">
</div>
<button type="submit" name="action" value="update" class="btn btn-primary">Paivita</button>
</form>
<?php
include_once("footer.html");
}
}
?>