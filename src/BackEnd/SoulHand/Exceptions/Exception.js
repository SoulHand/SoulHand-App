function Exception(msg){
	var message=msg;
	this.code='000';
	this.status=500;
	this.setMessage=function(txt){
		message=txt;
	}
	this.toString=function(){
		return message;
	}
}
module.exports=Exception;