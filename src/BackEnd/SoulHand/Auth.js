var Token=require("./Token.js");
var UserException=require('./Exceptions/UserException.js');
var Validator=require('string-validator');

module.exports.isAdmin=function(request,response,next){
	if(!Validator.isBase64()(request.query.PublicKeyId) || !Validator.isUUID()(request.query.PrivateKeyId)){
		throw new UserException('Token invalidos');
	}
	var user=new Token(this.database.Schema.Sessions);
	var address=request.connection.address() || request.socket.address();
	var navigator=request.headers['user-agent'];
	user.find({
		$and:[
			{publicKeyId:request.query.PublicKeyId},
			{privateKeyId:request.query.PrivateKeyId},
			{ip:address.address},
			{navigator:navigator},
			{dateDeleted:null}
		]
	}).then(function(data){
		if(!data || data.user.isAdmin!=true){
			throw new UserException('No posee permisos administrativos');			
		}
		request.user=data.user;
		next();
	}).catch(function(error){
		next(error);		
	})
}
module.exports.isUser=function(request,response,next){
	if(!Validator.isBase64()(request.query.PublicKeyId) || !Validator.isUUID()(request.query.PrivateKeyId)){
		throw new UserException('Token invalidos');
	}
	var user=new Token(this.database.Schema.Sessions);
	var address=request.connection.address() || request.socket.address();
	var navigator=request.headers['user-agent'];
	user.find({
		$and:[
			{publicKeyId:request.query.PublicKeyId},
			{privateKeyId:request.query.PrivateKeyId},
			{ip:address.address},
			{navigator:navigator},
			{dateDeleted:null}
		]
	}).then(function(data){		
		request.user=data.user;
		next();
	}).catch(function(error){
		next(error);		
	})
}
module.exports.isTeacherOrNot=function(request,response,next){
	if(!Validator.isBase64()(request.query.PublicKeyId) || !Validator.isUUID()(request.query.PrivateKeyId)){
		throw new UserException('Token invalidos');
	}
	var user=new Token(this.database.Schema.Sessions);
	var address=request.connection.address() || request.socket.address();
	var navigator=request.headers['user-agent'];
	user.find({
		$and:[
			{publicKeyId:request.query.PublicKeyId},
			{privateKeyId:request.query.PrivateKeyId},
			{ip:address.address},
			{navigator:navigator},
			{dateDeleted:null}
		]
	}).then(function(data){
		if(data.user.isAdmin!=true && data.user.people.mode!="TEACHER"){
			throw new UserException('No posee permisos de docente');			
		}		
		request.user=data.user;
		next();
	}).catch(function(error){
		next(error);		
	})
}
module.exports.isTeacher=function(request,response,next){
	if(!Validator.isBase64()(request.query.PublicKeyId) || !Validator.isUUID()(request.query.PrivateKeyId)){
		throw new UserException('Token invalidos');
	}
	var Schema=this.database.Schema;
	var user=new Token(this.database.Schema.Sessions);
	var address=request.connection.address() || request.socket.address();
	var navigator=request.headers['user-agent'];
	user.find({
		$and:[
			{publicKeyId:request.query.PublicKeyId},
			{privateKeyId:request.query.PrivateKeyId},
			{ip:address.address},
			{navigator:navigator},
			{dateDeleted:null}
		]
	}).then(function(data){
		if(data.user.people.mode!="TEACHER"){
			throw new UserException('No posee permisos de docente');			
		}
		request.user=data.user;
		return Schema.Teachers.findOne({"data._id":data.user.people._id});
	}).then(function(data){
		request.people=data;
		next();		
	}).catch(function(error){
		next(error);		
	})
}

module.exports.isEditable=function(request,response,next){
	var Schema=this.database.Schema;
	var address=request.connection.address() || request.socket.address();
	var navigator=request.headers['user-agent'];
	user.find({
		$and:[
			{publicKeyId:request.query.PublicKeyId},
			{privateKeyId:request.query.PrivateKeyId},
			{ip:address.address},
			{navigator:navigator},
			{dateDeleted:null}
		]
	}).then(function(data){
		if(data.user.people.mode!="TEACHER"){
			throw new UserException('No posee permisos de docente');			
		}
		request.user=data.user;
		return Schema.Teachers.findOne({"data._id":data.user.people._id});
	}).then(function(data){
		request.people=data;
		next();		
	}).catch(function(error){
		next(error);		
	})
}