'use strict';

function IdentificationService() {
  var self = this,
      http = require('http'),
      mqtt = require('./mqtt'),
      guid = require('./guid'),
      Q = require('q'),
      tenantId,
      uniqueId,
      isinitialised = false,
      macaddress = require('macaddress'),
      agentId = guid(),
      initPromise = undefined;

  self.init = init;
  self.isInitialised = isInitialised;
  self.getTenantId = getTenantId;
  self.getUniqueId = getUniqueId;
  self.getTopic = getTopic;

  function init(apiKey) {
    initPromise = Q.defer();

    macaddress.one(function(err, mac) {
      var initObject = {
        'id': agentId,
        'apiKey': apiKey,
        'mac': mac
      };

      console.log(JSON.stringify(initObject));
      console.log(mqtt);

      mqtt.subscribe(agentId, finishInit);
      mqtt.sendInit(initObject);
    });

    return initPromise.promise;
  }

  function finishInit(topic, message, packet) {
    console.log('got back info on INIT');
    mqtt.unSubscribe(agentId, finishInit);

    var data = JSON.parse(message);

    console.log(data);

    uniqueId = data.id;
    tenantId = data.tenant;

    mqtt.setTopic(getTopic());

    if (initPromise) {
      initPromise.resolve(getTopic());
      initPromise = null;
    }
  }

  function isInitialised() {
    return isinitialised;
  }

  function getTopic() { 
    return getTenantId() + '/' + getUniqueId() + '/';
  }

  function getUniqueId() {
    return uniqueId;
  }

  function getTenantId() {
    return tenantId;
  }
}

module.exports = exports = new IdentificationService();
