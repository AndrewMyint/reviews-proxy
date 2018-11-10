const express = require('express');
const proxy = require('http-proxy-middleware');
const bodyParser = require('body-parser');
const path = require('path');
const compression = require('compression');

const app = express();
const port = 8081;

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
    target: 'http://ec2-18-221-46-200.us-east-2.compute.amazonaws.com/',
    changeOrigin: true
  })
);

// reviews

app.use(
  '/api/movies/:movieid/rating',
  proxy({
    target: 'http://fecservice-env.ykmr3kmu2p.us-west-1.elasticbeanstalk.com/',
    changeOrigin: true
  })
);

app.use(
  '/api/movies/:movieid/reviews',
  proxy({
    target: 'http://fecservice-env.ykmr3kmu2p.us-west-1.elasticbeanstalk.com/',
    changeOrigin: true
  })
);

// summary

app.use(
  '/api/movies/:movieId/summary',
  proxy({
    target: 'http://ec2-3-16-124-117.us-east-2.compute.amazonaws.com/',
    changeOrigin: true
  })
);

// movie times

app.use(
  '/api/moviesbyid/:movieid/:date/:location',
  proxy({
    target: 'http://ec2-54-241-179-157.us-west-1.compute.amazonaws.com:3002/',
    changeOrigin: true
  })
);

// app.listen(port, () => console.log('listening on port', process.env.PORT || port));
app.listen(port, () => console.log('listening on port', port));
module.exports = app;
