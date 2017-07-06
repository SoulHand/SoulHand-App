var App = require("./server.js");
process.env.NODE_ENV = 'test';
//process.env.NODE_ENV = 'production';

var app = new App();
app.start().then((addr) => {
  console.info('Chat server listening at', addr.address + ':' + addr.port);
})
