var InsertException=require("./Exceptions/InsertException.js");
var VoidException=require("./Exceptions/VoidException.js");

function CRUD(db){
	this.add=function(query,input){
		var p1=db.findOne(query).exec().then(function(data){
			if(data){
				throw new InsertException("No se puede insertar un registro duplicado");
			}
			var grade= new db(input);
			return grade.save();
		});
		return p1;
	};
	this.find=function(query){
		var p1=db.findOne(query).exec().then(function(data){
			if(!data){
				throw new VoidException("No existe un registro de este tipo");
			}
			return data;
		});
		return p1;
	};
	this.get=function(query){
		var p1=db.find(query).exec().then(function(data){
			if(data.length==0){
				throw new VoidException("No existe un resultado de busqueda");
			}
			return data;
		});
		return p1;
	};
	this.update=function(query,callback){
		var p1=this.find(query).then(function(data){
			var replace=callback(data);
			return replace.save();
		});
		return p1;
	};
	this.remove=function(query){
		var p1=this.find(query).then(function(data){
			return data.remove();
		});
		return p1;
	};
}
module.exports=CRUD;