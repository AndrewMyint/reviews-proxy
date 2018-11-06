const express = require('express');

const bodyParser = require('body-parser');
const path = require('path');

const fetch = require('node-fetch');
const app = express();
const port = 3010;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.resolve(__dirname, '../client/')));

app.use((request, response, next) => {
  response.set({
    'Access-Control-Allow-Origin': '*'
  });
  next();
});

// dada
app.get('/api/movies/:genre/relatedmovies', (req, res) => {
  fetch(`http://localhost:3003/api/movies/${req.params.genre}/relatedmovies`)
    .then(response => {
      response.json()
        .then(data => {
          res.send(data);
        });
    })
    .catch(error => {
      res.send(500, error);
    });
});

// reviews
app.get('/api/movies/:movieid/rating', (req, res) => {
  fetch(`http://localhost:3013/api/movies/${req.params.movieid}/rating`)
    .then(response => {
      response.json()
        .then(data => {
          res.send(data);
        });
    })
    .catch(error => {
      res.send(500, error);
    });
});

app.get('/api/movies/:movieid/reviews', (req, res) => {
  fetch(`http://localhost:3013/api/movies/${req.params.movieid}/reviews`)
    .then(response => {
      response.json()
        .then(data => {
          res.send(data);
        });
    })
    .catch(error => {
      res.send(500, error);
    });
});

// summary
app.get('/api/movies/:movieId/summary', (req, res) => {
  fetch(`http://localhost:3007/api/movies/${req.params.movieId}/summary`)
    .then(response => {
      response.json()
        .then(data => {
          res.send(data);
        })
    })
    .catch(error => {
      res.send(500, error);
    });
});

// movie times
app.get('/api/moviesbyid/:movieid/:date/:location', (req, res) => {
  const { movieid, date, location } = req.params;
  fetch(`http://localhost:3002/api/moviesbyid/${movieid}/${date}/${location}`)
    .then(response => {
      response.json()
        .then(data => {
          res.send(data);
        });
    })
    .catch(error => {
      res.send(500, error);
    });
});

// app.get('/api/movies/:movie/:date/:location', (req, res) => {
//   const { movie, date, location } = req.params;
//   fetch(`http://localhost:3002/api/movies/${movie}/${date}/${location}`)
//     .then(response => {
//       response.json()
//         .then(data => {
//           res.send(data);
//         });
//     })
//     .catch(error => {
//       res.send(500, error);
//     });
// });

app.listen(port, () => console.log('listening on port', port));

module.exports = app;
