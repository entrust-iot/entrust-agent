var mqtt = require('./mqtt'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express()

console.log('Entrust Agent starting');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/api/:key', function(req, res) {
  var key = req.params.key;
  var value = req.body;

  console.log('received data to bubble up:');
  console.log('key: ', key);
  console.log('payload: ', value);

  mqtt.send(key, value);
  res.end();
});

var server = app.listen(8080);
