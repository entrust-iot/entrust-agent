'use strict';

function Agent() {
  var self = this,
      mqtt = require('./mqtt'),
      id = require('./identification');

  self.init = init;
  self.ready = ready;
  self.send = send;

  function init(apiKey) {
    return mqtt.connected().then(function(agentId) {
      return id.init(apiKey, agentId);
    });
  }

  function ready() {
    return id.isInitialised();
  }

  function send(key, value) {
    mqtt.send(key, value);
  }
}

module.exports = new Agent();
