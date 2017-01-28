var Grade=require("./SoulHand/Grade.js");
var Validator=require('string-validator');
var ValidatorException=require('./SoulHand/Exceptions/ValidatorException.js');

module.exports=function(app,express,server,__DIR__){
	var gradeURI = express.Router();
	gradeURI.post("/",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		grade.add(request.body.name).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	gradeURI.get("/",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);		
		grade.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	gradeURI.get("/:name",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);			
		grade.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	gradeURI.put("/:name",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		grade.update({_id:request.params.name},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/grades",gradeURI);
}