var Exception=require('./Exception.js');
function ValidatorException(message){
	this.superConstructor = Exception
	this.superConstructor(message);
	this.code='130';
	this.status=400;
}
ValidatorException.prototype=new Exception();
module.exports=ValidatorException;
