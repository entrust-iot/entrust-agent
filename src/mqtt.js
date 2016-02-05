'use strict';


function MqttInterface() {
  var self = this;
  var client = undefined;
  var topic = undefined;

  var mqtt = require('mqtt'),
      Q = require('q'),
      discovery = require('./discovery'),
      connectionPromise = Q.defer();

  const fs = require('fs');

  const SEC_DIR = 'security';
  const SECURE_CERT = SEC_DIR + '/client.crt';
  const SECURE_KEY = SEC_DIR + '/client.key';
  const SECURE_CA = SEC_DIR + '/ca.crt';

  self.send = sendService;
  self.connected = connected;
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

  function connected() {
    return connectionPromise.promise;
  }

  function connect() {
    discovery.getEdgeGatewayIp().then(function(serverIp) {
      console.log('edge gw ip:', serverIp);
      readSecureFiles().then(function(options) {
        client = mqtt.connect('mqtts://' + serverIp, options);
        setupEventHandler();
      }).done();
    });
  }

  function readSecureFiles() {
    return Q.all([SECURE_CERT, SECURE_KEY, SECURE_CA]
      .map(function(path) {
        return Q.nfcall(fs.readFile, path);
      }))
    .spread(function (cert, key, ca) {
      return {
        cert: cert,
        key: key,
        ca: ca
      };
    });
  };

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
    connectionPromise = Q.defer();
    connect();
  }

  function setupEventHandler() {
    client.on('connect', connectionHandler);
    client.on('close', closeHandler);
  }

  function connectionHandler() {
    console.log('mqtt connection established to server');
    self.isConnected = true;
    connectionPromise.resolve();
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

  connect();
}

module.exports = new MqttInterface();
