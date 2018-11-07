const express = require('express');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');
const fetch = require('node-fetch');

const app = express();
const port = 3010;

app.use(compression());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/movies/1');
});

app.use(express.static('../public'));
app.get('/movies/:id', (req, res) => {
  const filePath = path.join(__dirname, '../public/index.html');
  res.sendFile(filePath);
});

// app.use(express.static(path.resolve(__dirname, '../public/')));

app.use((request, response, next) => {
  response.set({
    'Access-Control-Allow-Origin': '*'
  });
  next();
});

// related
app.use(
  '/api/movies/:genre/relatedmovies',
  proxy({
    target: 'http://localhost:3003',
    changeOrigin: true
  })
);

// reviews

app.use(
  '/api/movies/:movieid/rating',
  proxy({
    target: 'http://localhost:3013',
    changeOrigin: true
  })
);

app.use(
  '/api/movies/:movieid/reviews',
  proxy({
    target: 'http://localhost:3013',
    changeOrigin: true
  })
);

// summary

app.use(
  '/api/movies/:movieId/summary',
  proxy({
    target: 'http://localhost:3007',
    changeOrigin: true
  })
);

// movie times

app.use(
  '/api/moviesbyid/:movieid/:date/:location',
  proxy({
    target: 'http://localhost:3002',
    changeOrigin: true
  })
);

// not being used
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
