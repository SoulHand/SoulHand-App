var User=require("./SoulHand/User.js");
var VoidException=require("./SoulHand/Exceptions/VoidException.js");

module.exports=function(app,express,server,__DIR__){
	const uuidV4 = require('uuid/v4');
	const base64=require('base-64');
	var admin=new User(app.container.database.Schema.User);
	var password=uuidV4();
	var people=app.container.database.Schema.Peoples({
		dni:password,
		name:"ROOT USER",
		birthdate:"1970-01-01",
		mode:"TEACHER"
	});
	admin.get({isAdmin:true}).catch(function(error){
		if(error instanceof VoidException){
			people.save().then(function(){
				return admin.add({
					username:"root",
					password:base64.encode(password),
					isAdmin:true,
					people:people
				});
			}).then(function(data){
				console.log("No existe usuario root, el sistema ha insertado un usuario\nUsuario:"+data.username+"\npassword:"+password)
			})
		}
	});
}