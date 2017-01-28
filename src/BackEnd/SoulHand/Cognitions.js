var CRUD=require('./CRUD.js');

function Cognitions(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(input){
		return add({name:input.name},input);
	}
}
Cognitions.prototype=new CRUD();
module.exports=Cognitions;