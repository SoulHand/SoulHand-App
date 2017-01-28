var Exception=require('./Exception.js');
function InsertException(message){
	this.superConstructor = Exception
	this.superConstructor(message);
	this.code='110';
	this.status=400;
}
InsertException.prototype=new Exception();
module.exports=InsertException;