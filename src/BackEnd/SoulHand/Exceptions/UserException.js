var Exception=require('./Exception.js');
function UserException(message){
	this.superConstructor = Exception
	this.superConstructor(message);
	this.code='500';
	this.status=401;
}
UserException.prototype=new Exception();
module.exports=UserException;