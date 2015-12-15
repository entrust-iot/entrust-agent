'use strict';

var mqtt = require('./mqtt'),
    id = require('./identification'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express()

console.log('Entrust Agent starting');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/login/:key', function(req, res) {
  console.log('login attempt');
  var apiKey = req.params.key;

  id.init(apiKey)
    .then(function success(topic) {
      res.send(topic);
    }, function error() {
      res.status(404);
    });
});

app.post('/api/:key', function(req, res) {
  if (!id.isInitialised()) {
    res.status(403);
    res.end();
    return;
  }

  var key = req.params.key;
  var value = req.body;

  console.log('received data to bubble up:');
  console.log('key: ', key);
  console.log('payload: ', value);

  mqtt.send(key, value);
  res.end();
});

var server = app.listen(8080);
