'use strict';


function MqttInterface() {
  var self = this;
  var client = undefined;
  var topic = undefined;

  var mqtt = require('mqtt'),
      Q = require('q'),
      discovery = require('./discovery');

  self.send = sendService;
  self.connect = connect;
  self.isConnected = false;
  self.setTopic = setTopic;
  self.sendInit = sendInit;
  self.subscribe = subscribe;
  self.unSubscribe = unSubscribe;

  function sendInit(initObject) {
    send('init', initObject);
  }

  function sendService(key, value) {
    send(getTopic(key), value);
  }

  function send(topic, value) {
    if (self.isConnected) {
      client.publish(topic, JSON.stringify(value));
    } else {
      console.log('no can send');
    }
  }

  function connect() {
    return discovery.getEdgeGatewayIp().then(function(serverIp) {
      console.log('edge gw ip:', serverIp);
      client = mqtt.connect('mqtt://' + serverIp);
      return setupEventHandler();
    });
  }

  function subscribe(topic, cb) {
    if (client) {
      client.subscribe('agents/'+topic);
      client.on('message', cb);
    }
  }

  function unSubscribe(topic, cb) {
    client.unsubscribe('agents/'+topic)
    client.removeListener('message', cb);
  }

  function closeHandler() {
    self.isConnected = false;
    removeHandlers();
    client = undefined;
    connect();
  }

  function setupEventHandler() {
    var connectionPromise = Q.defer();
    client.on('connect', connectionHandler(connectionPromise));
    client.on('close', closeHandler);
    return connectionPromise.promise;
  }

  function connectionHandler(promise) {
    return function () {
      console.log('mqtt connection established to server');
      self.isConnected = true;
      promise.resolve();
    };
  }

  function removeHandlers() {
    client.removeListener('connect', connectionHandler);
    client.removeListener('close', closeHandler);
  }

  function getTopic(key) {
    return 'service/' + topic + key;
  }

  function setTopic(t) {
    topic = t;
  }
}

module.exports = new MqttInterface();
