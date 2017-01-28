var CRUD=require('./CRUD.js');

function SubPeople(db){
	var self=this;
	this.superConstructor = CRUD;
	this.superConstructor(db);
	var add=this.add.bind(this);
	this.add=function(input){
		return add({"data.dni":input.data.dni},input);
	}
}
SubPeople.prototype=new CRUD();
module.exports=SubPeople;