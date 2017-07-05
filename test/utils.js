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
	var p1=new Promise(function(complete,reject){
    var App = require("../server.js");
    process.env.NODE_ENV = "test";
    var app = new App();
    app.start().then((addr) => {
      request[method.toLowerCase()]("http://0.0.0.0:"+addr.port+uri,args,function(error,request,response){
        app.close()
        if(error){ reject(error)}
        complete(response)
      })
    });
  });
  return p1;
}
