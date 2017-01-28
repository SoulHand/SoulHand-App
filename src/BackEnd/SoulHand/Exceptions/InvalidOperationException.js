var Exception=require('./Exception.js');
function InvalidOperationException(message){
	this.superConstructor = Exception
	this.superConstructor(message);
	this.code='100';
	this.status=400;
}
InvalidOperationException.prototype=new Exception();
module.exports=InvalidOperationException;