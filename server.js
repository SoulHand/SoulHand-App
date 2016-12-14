var express = require('express');  
var app = express();
var server = require('http').Server(app);
//Global Config
app.settings=require('./src//BackEnd/config.js').settings(__dirname);

process.env.NODE_ENV = 'production';

/* middleware */
require('./src/BackEnd/middleware.js')(app,express,server,__dirname);

/* Dependences */
app.container=require('./src/BackEnd/dependences.js')(app);

/* Routes */
require('./src/BackEnd/routes.js')(app,express,server,__dirname);



server.listen(app.settings.port || 8080, function() {
	var addr = server.address();
	console.log("Chat server listening at", addr.address + ":" + addr.port);
});


//not Found Middleware
app.use(function(req, res, next) {
  res.status(404).send({code:404,message:"No existe la ruta!"});
});