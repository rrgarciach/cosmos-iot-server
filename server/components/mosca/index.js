(function () {
  'use strict';

  const mosca = require('mosca');

  const ASCOLTATORE = {
    type: 'mongo',
    url: 'mongodb://localhost:27017/mqtt',
    pubsubCollection: 'ascoltatori',
    mongo: {}
  };

  const SETTINGS = {
    port: 1883,
    backend: ASCOLTATORE,
    persistence: {
      factory: mosca.persistence.Mongo,
      url: 'mongodb://localhost:27017/mqtt'
    }
  };

  class MqttServer {
    constructor(settings) {
      this.clients = [];
      this.settings = settings;
    }

    // fired when the mqtt server is ready
    setup() {
      console.log('Mosca MQTT server is up and running');
    }

    init() {
      this.server = new mosca.Server(SETTINGS);
      this.server.on('ready', this.setup);

      // Fired when a client connects
      this.server.on('clientConnected', function (client) {
        console.log('Client Connected:', client.id);
        this.clients.push(client);
      });

      // fired when a client disconnects
      this.server.on('clientDisconnected', function (client) {
        console.log('Client Disconnected:', client.id);
        let index = this.clients.indexOf(client);
        this.clients.splice(index, 1);
      });

      // fired when a message is published
      this.server.on('published', function (packet, client) {
        console.log('Published payload:', packet.payload.toString('utf8'));
      });
    }

    on(event, callback) {
      this.server.on(event, callback);
    }

    publish(message, callback) {
      this.server.publish(message, callback);
    }
  }

  module.exports = new MqttServer(SETTINGS);

})();