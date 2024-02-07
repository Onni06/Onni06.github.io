<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Star Wars Elokuvat</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
</head>
<body>

<div class="container mt-5">
  <h2>Tähtien Sota Elokuvat</h2>

  <table class="table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Opening Crawl</th>
        <th>Director</th>
        <th>Release Date</th>
        <th>Starships</th>
        <th>Characters</th>
        <th>Planets</th>
      </tr>
    </thead>
    <tbody>

    <?php
    $url = "https://swapi.dev/api/films/";
    $response = file_get_contents($url);

    if ($response !== false) {
        $data = json_decode($response, true);
        $films = $data['results'] ?? [];

        foreach ($films as $film) {
            echo '<tr>';
            echo '<td>' . $film['title'] . '</td>';
            echo '<td>' . substr($film['opening_crawl'], 0, 50) . '... <a href="#" data-toggle="modal" data-target="#myModal' . $film['episode_id'] . '">Lue lisää</a></td>';
            echo '<td>' . $film['director'] . '</td>';
            echo '<td>' . $film['release_date'] . '</td>';
            echo '<td><a href="starships.php?film=' . $film['episode_id'] . '">Link</a></td>';
            echo '<td><a href="characters.php?film=' . $film['episode_id'] . '">Link</a></td>';
            echo '<td><a href="planets.php?film=' . $film['episode_id'] . '">Link</a></td>';
            echo '</tr>';

            // Modal
            echo '<div class="modal fade" id="myModal' . $film['episode_id'] . '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
            echo '<div class="modal-dialog" role="document">';
            echo '<div class="modal-content">';
            echo '<div class="modal-header">';
            echo '<h5 class="modal-title" id="myModalLabel">' . $film['title'] . '</h5>';
            echo '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
            echo '<span aria-hidden="true">&times;</span>';
            echo '</button>';
            echo '</div>';
            echo '<div class="modal-body">';
            echo '<p>' . nl2br($film['opening_crawl']) . '</p>';
            echo '<p><a href="starships.php?film=' . $film['episode_id'] . '">Starships</a></p>';
            echo '<p><a href="characters.php?film=' . $film['episode_id'] . '">Characters</a></p>';
            echo '<p><a href="planets.php?film=' . $film['episode_id'] . '">Planets</a></p>';
            echo '</div>';
            echo '<div class="modal-footer">';
            echo '<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
        }
    } else {
        echo '<tr><td colspan="7">Virhe haettaessa tietoja.</td></tr>';
    }
    ?>

    </tbody>
  </table>

</div>

<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.0.7/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

</body>
</html>
