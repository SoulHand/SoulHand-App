var express = require('express');  
var app = express();  
var path = require('path');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
//Global Config
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.settings=require('./src/BackEnd/config.js').settings(__dirname);
//process.env.NODE_ENV = 'production';
/* Dependences */
app.container=require('./src/BackEnd/dependences.js')(app);

//middleware
require('./src/BackEnd/middleware.js')(app,express,server,__dirname);

/* Routes */
require('./src/BackEnd/routes.js')(app,express,server,__dirname);

server.listen(app.settings.port || 8080, function() {
	var addr = server.address();
	console.log("Chat server listening at", addr.address + ":" + addr.port);
});

if(app.container.ErrorHandler){
	app.use(app.container.ErrorHandler);
}
//not Found Middleware
app.use(function(req, res, next) {
  res.status(404).send({code:404,message:"No existe la ruta!"});
});