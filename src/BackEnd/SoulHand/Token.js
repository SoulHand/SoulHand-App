var CRUD=require('./CRUD.js');
var VoidException=require("./Exceptions/VoidException.js");

function Token(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(input){
		return add({$or : [{username:input.username}, {email:input.email},{"people.dni":input.people.dni}]},input);
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