var User=require("./SoulHand/User.js");
var VoidException=require("./SoulHand/Exceptions/VoidException.js");

module.exports=function(app,express,server,__DIR__){
	var admin=new User(app.container.database.Schema.User);
	admin.get({isAdmin:true}).catch(function(error){
		if(error instanceof VoidException){
			const uuidV4 = require('uuid/v4');
			const base64=require('base-64');
			var password=uuidV4();
			admin.add({
				username:"root",
				password:base64.encode(password),
				isAdmin:true,
				people:{
					dni:password,
					name:"ROOT USER",
					birthdate:"1970-01-01",
					mode:"TEACHER"
				}
			}).then(function(data){
				console.log("No existe usuario root, el sistema ha insertado un usuario\nUsuario:"+data.username+"\npassword:"+password)
			})
		}
	});
}