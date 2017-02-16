var CRUD=require('./CRUD.js');
var VoidException=require("./Exceptions/VoidException.js");

function Token(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(user,ip,navigator){
		const uuidV4 = require('uuid/v4');
		const base64=require('base-64');
		var p1 = self.find({$and:[{user:user._id},{ip:ip},{navigator:navigator},{dateDeleted:null}]}).then(function(token){
			if(!token){
				token= new db({
					privateKeyId:uuidV4(),
					publicKeyId:base64.encode(user._id),
					ip:ip,
					navigator:navigator,
					dateCreated:Date.now(),
					dateLastConnect:Date.now(),
					user:user._id
				});
				token.save();
				token.user=user;
				return token;
			}
			token.dateLastConnect=Date.now();
			return token.save();
		});
		return p1;
	}
	this.find=function(query){
		var p1=db.findOne(query).populate('user').then(function(data){				
			return data;
		});
		return p1;
	}	
}
Token.prototype=new CRUD();
module.exports=Token;