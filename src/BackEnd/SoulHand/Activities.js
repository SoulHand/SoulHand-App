var CRUD=require('./CRUD.js');

function Activities(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(input){
		return add({name:input.name},input);
	}
}
Activities.prototype=new CRUD();
module.exports=Activities;