var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://192.168.99.100');

export.send = function (topic, message) {
  console.log('Sending', message, 'to', topic);
};

client.on('connect', function () {
  client.subscribe('presence');
  client.publish('presence', 'Hello mqtt');
});
 
client.on('message', function (topic, message) {
  // message is Buffer 
  console.log(message.toString());
  client.end();
});
