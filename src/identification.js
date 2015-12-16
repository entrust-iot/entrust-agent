'use strict';

function IdentificationService() {
  var self = this,
      http = require('http'),
      Q = require('q'),
      tenantId,
      uniqueId,
      isinitialised = false,
      identificationServerUrl = 'http://stark-shore-8953.herokuapp.com/init' ;

  self.init = init;
  self.isInitialised = isInitialised;
  self.getTenantId = getTenantId;
  self.getUniqueId = getUniqueId;
  self.getTopic = getTopic;

  function init(apiKey) {
    var q = Q.defer();

    http.get(identificationServerUrl, function(res) {
      res.on('data', function (chunk) {
        var data = JSON.parse(chunk);

        uniqueId = data.id;
        tenantId = data.tenant;
        
        isinitialised = true;
        q.resolve(getTopic());
      });
    });

    return q.promise;
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
