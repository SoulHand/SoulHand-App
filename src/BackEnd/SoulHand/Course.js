var CRUD=require('./CRUD.js');

function Course(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(name){
		var query={name:name.toUpperCase()};
		return add(query,query);
	}
}
Course.prototype=new CRUD();
module.exports=Course;