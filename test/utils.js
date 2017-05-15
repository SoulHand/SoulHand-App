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
module.exports.dropDatabase=function(done){
	var db=this.db;
	db.db.dropDatabase(function(){
		db.db.close(function(){
			done();
		});
	});
}



function insertUser(db){
	var p1=db.schema.Peoples({
		dni:'V12345678',
		name:"ROOT USER",
		birthdate:"1970-01-01",
		mode:"TEACHER",
		genero:"FEMENINO"

	});
	var p2=db.schema.User({
			username:"root",
			password:'12345',
			isAdmin:true,
			people:p1
		});
	return Promise.all([p1.save(),p2.save()]);
}
module.exports.insertUser=insertUser

function insertSession(db){
	var p1=insertUser(db).then(function(data){
		var user=data[1];
		const uuidV4 = require('uuid/v4');
				const base64=require('base-64');
				return db.schema.Sessions({
					privateKeyId:uuidV4(),
					publicKeyId:base64.encode(user._id),
					ip:'::ffff:127.0.0.1',
					navigator:undefined,
					dateCreated:Date.now(),
					dateLastConnect:Date.now(),
					user:user._id
				}).save();
	});
	return p1;
}
module.exports.insertSession=insertSession;


module.exports.runApp=function(method,uri,args){
	var express = require('express');
  const logger = require('winston')
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
	app.container=require('../src/BackEnd/dependences.js')(app, __dirname + '/../');

	//middleware
	require('../src/BackEnd/middleware.js')(app,express,server,  __dirname + '/../');

	/* Routes */
	require('../src/BackEnd/routes.js')(app,express,server,  __dirname + '/../');


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
			request[method.toLowerCase()]("http://0.0.0.0:"+port+uri,args,function(error,request,response){
				if(error){ reject(error)}
				app.container.database.db.close(function(){
					server.close(function(){
            logger.remove(logger.transports.File,
            {filename: path.join(uri, '/server.log')})
						complete(response)
					});
				})
			})
		})
		return p2;
	});
	return p1;
}
