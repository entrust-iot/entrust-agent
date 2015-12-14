var mqtt = require('mqtt'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express()

console.log('Entrust Agent starting');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/api/:key', function(req, res) {
  console.log('received data to bubble up:');
  console.log('key: ', req.params.key);
  console.log('payload: ', req.body);

  res.send('hello world' + req.params.key);
});

var server = app.listen(8080);
