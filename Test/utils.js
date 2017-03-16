var request=require("request");

module.exports.getDatabase=function(){
	var mongoose= require('mongoose');
	var settings= require('../src/BackEnd/config.js').settings();
	var db = mongoose.createConnection(settings.database.dnsTest);
	var structDb=require("../src/BackEnd/models.js");
	var Schema={};
	for( var i in structDb){
		Schema[i]=db.model(i, structDb[i]);
	}
	return {
		db:db,
		schema:Schema
	};
}

module.exports.runApp=function(method,uri,args){
	var express = require('express');  
	var app = express();  
	var path = require('path');
	var server = require('http').Server(app);
	var bodyParser = require('body-parser');
	var multer = require('multer'); // v1.0.5
	var upload = multer(); // for parsing multipart/form-data
	//Global Config
	app.use(bodyParser.json()); // for parsing application/json
	app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
	app.use(upload.array()); // for parsing application/x-www-form-urlencoded
	app.settings=require('../src/BackEnd/config.js').settings(__dirname);
	app.settings.database.dns=app.settings.database.dnsTest;
	//process.env.NODE_ENV = 'production';
	/* Dependences */
	app.container=require('../src/BackEnd/dependences.js')(app);

	//middleware
	require('../src/BackEnd/middleware.js')(app,express,server,__dirname);

	/* Routes */
	require('../src/BackEnd/routes.js')(app,express,server,__dirname);


	if(app.container.ErrorHandler){
		app.use(app.container.ErrorHandler);
	}
	//not Found Middleware
	app.use(function(req, res, next) {
	  res.status(404).send({code:404,message:"No existe la ruta!"});
	});
	var p1=new Promise(function(complete,reject){
		server.listen(app.settings.port || 8080, function() {
			var addr = server.address();
			complete(addr.port)
		});
	}).then(function(port){
		var p2=new Promise(function(complete,reject){
			request[method.toLowerCase()]("http://0.0.0.0:"+port+uri,function(error,request,response){
				app.container.database.db.close(function(){
					server.close(function(){
						complete(JSON.parse(response));
					});
				})
			})			
		})
		return p2;
	});
	return p1;
}