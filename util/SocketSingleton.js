var socket = require('socket.io');

var SocketSingleton = (function() {
  this.io = null;
  this.configure = function(server) {
    this.io = socket(server,{
        cors: {
            origin: "http://192.168.68.120:8080",
            methods: ["GET", "POST"],
          }
    });
  }

  return this;
})();

module.exports = SocketSingleton;