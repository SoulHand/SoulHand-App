var CRUD=require('./CRUD.js');

function People(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(input){
		return add({"dni":input.dni},input);
	}
}
People.prototype=new CRUD();
module.exports=People;