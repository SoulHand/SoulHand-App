var CRUD=require('./CRUD.js');
var UserException=require("./Exceptions/UserException.js");

function User(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(input){
		return add({$or : [{username:input.username}, {email:input.email},{"people.dni":input.people.dni}]},input);
	}
}
User.prototype=new CRUD();
module.exports=User;