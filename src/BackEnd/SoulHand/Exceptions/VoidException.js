var Exception=require('./Exception.js');
function VoidException(message){
	this.superConstructor = Exception
	this.superConstructor(message);
	this.code='100';
	this.status=204;
}
VoidException.prototype=new Exception();
module.exports=VoidException;