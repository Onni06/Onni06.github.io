<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Characters</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>

<div class="container mt-5">
  <h2>Characters</h2>

  <?php
  if (isset($_GET['film'])) {
    $url = "https://swapi.dev/api/films/{$_GET['film']}/";

      $response = file_get_contents($url);

      if ($response !== false) {
          $film = json_decode($response, true);

          // Käsittele täällä hahmoihin liittyvät tiedot
          // Esimerkiksi: $characters = $film['characters'];

          echo '<p>Characters in ' . $film['title'] . ':</p>';
          echo '<ul>';
          // Tulosta hahmot täällä
          // Esimerkiksi: foreach ($characters as $character) { echo '<li>' . $character . '</li>'; }
          echo '</ul>';
      } else {
          echo '<p>Virhe haettaessa tietoja.</p>';
      }
  } else {
      echo '<p>Virhe: Elokuvan tunnus puuttuu.</p>';
  }
  ?>

</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.0.7/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>
