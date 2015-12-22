'use strict';

var mqtt = require('mqtt'),
    id = require('./identification'),
    discovery = require('./discovery');

function MqttInterface() {
  var self = this;
  var client = undefined;

  self.send = send;
  self.isConnected = false;

  function send(key, value) {
    if (self.isConnected) {
      client.publish(getTopic(key), JSON.stringify(value));
    } else {
      console.log('no can send');
    }
  }

  function connect() {
    discovery.getEdgeGatewayIp().then(function(serverIp) {
      console.log('edge gw ip:', serverIp);
      client = mqtt.connect('mqtt://' + serverIp);
      setupEventHandler();
    });
  }

  function connectionHandler() {
    console.log('mqtt connection established to server');
    self.isConnected = true;
  }

  function closeHandler() {
    self.isConnected = false;
    removeHandlers();
    client = undefined;
    connect();
  }

  function setupEventHandler() {
    client.on('connect', connectionHandler);
    client.on('close', closeHandler);
  }

  function removeHandlers() {
    client.removeListener('connect', connectionHandler);
    client.removeListener('close', closeHandler);
  }

  function getTopic(key) {
    return id.getTopic() + key;
  }

  connect();

}

module.exports = new MqttInterface();
