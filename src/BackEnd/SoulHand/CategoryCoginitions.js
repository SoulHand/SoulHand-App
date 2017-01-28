var CRUD=require('./CRUD.js');

function CategoryCoginitions(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(name){
		var query={name:name};
		return add(query,query);
	}
}
CategoryCoginitions.prototype=new CRUD();
module.exports=CategoryCoginitions;