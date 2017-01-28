var Exception=require('./Exception.js');
function GradeException(message){
	this.superConstructor = Exception
	this.superConstructor(message);
	this.code='101';
	this.status=400;
}
GradeException.prototype=new Exception();
module.exports=GradeException;