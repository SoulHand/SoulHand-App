var CRUD=require('./CRUD.js');

function CategoryCoginitions(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(name,input){
		var query={name:name};
		return add(query,input);
	}
}
CategoryCoginitions.prototype=new CRUD();
module.exports=CategoryCoginitions;