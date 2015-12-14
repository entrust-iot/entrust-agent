var mqtt = require('mqtt');

function MqttInterface() {
  var self = this;

  self.send = send;
  self.isConnected = false;

  var client = mqtt.connect('mqtt://192.168.99.100');

  function send(key, value) {
    if (self.isConnected) {
      client.publish(getTopic(key), JSON.stringify(value));
    } else {
      console.log('no can send');
    }
  }

  function getTopic(key) {
    return '/tenant/id/' + key;
  }

  client.on('connect', function () {
    console.log('mqtt connection established to server');
    self.isConnected = true;
  });
}

module.exports = new MqttInterface();
