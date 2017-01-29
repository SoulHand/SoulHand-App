var CRUD=require('./CRUD.js');

function Habilities(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(input){
		return add({name:input.name},input);
	}
}
Habilities.prototype=new CRUD();
module.exports=Habilities;