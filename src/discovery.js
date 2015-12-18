'use strict';

function DiscoveryInterface() {
  var self = this,
      Q = require('q');

  self.getEdgeGatewayIp = getEdgeGatewayIp;

  function getEdgeGatewayIp() {
    var q = Q.defer();

    var dgram = require('dgram');
    var socket = dgram.createSocket('udp4');
    var broadcastPort = 5555;

    socket.bind(broadcastPort);

    socket.on("message", function ( data, rinfo ) {
      console.log("broadcast received from ", data.toString());
      socket.close();
      q.resolve(data.toString());
    });
    
    return q.promise;
  }
}

module.exports = new DiscoveryInterface();
