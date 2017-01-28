var Grade=require("./SoulHand/Grade.js");
var Course=require("./SoulHand/Course.js");
var Period=require("./SoulHand/Period.js");
var Cognitions=require("./SoulHand/Cognitions.js");
var CategoryCoginitions=require("./SoulHand/CategoryCoginitions.js");
var Validator=require('string-validator');
var ValidatorException=require('./SoulHand/Exceptions/ValidatorException.js');

module.exports=function(app,express,server,__DIR__){
	var gradeURI = express.Router();
	gradeURI.post("/",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		if(!Validator.isAlphanumeric()(request.body.name)){
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
		if(!Validator.isAlphanumeric()(request.body.name)){
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
	gradeURI.delete("/:name",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);		
		grade.remove({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/grades",gradeURI);
	var courseURI = express.Router();
	courseURI.post("/",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		course.add(request.body.name).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	courseURI.get("/",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);		
		course.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	courseURI.get("/:name",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);			
		course.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	courseURI.put("/:name",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		course.update({_id:request.params.name},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	courseURI.delete("/:name",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		course.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/courses",courseURI);
	var periodURI = express.Router();
	periodURI.post("/",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		if(!Validator.matches(/[0-9]{4}\-[0-9]{4}/i)(request.body.name)){
			throw new ValidatorException("Solo se acepta formato de periodo escolar");
		}
		period.add(request.body.name).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	periodURI.get("/",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);		
		period.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	periodURI.get("/:name",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);			
		period.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	periodURI.put("/:name",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		if(!Validator.matches(/[0-9]{4}\-[0-9]{4}/i)(request.body.name)){
			throw new ValidatorException("Solo se acepta formato de periodo escolar");
		}
		period.update({_id:request.params.name},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	periodURI.delete("/:name",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		period.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/periods",periodURI);
	var categoryCognitionURI = express.Router();
	categoryCognitionURI.post("/",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		category.add(request.body.name).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	categoryCognitionURI.get("/",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);		
		category.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	categoryCognitionURI.get("/:name",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);			
		category.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	categoryCognitionURI.put("/:name",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		category.update({_id:request.params.name},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	categoryCognitionURI.delete("/:name",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		category.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/category/cognitions",categoryCognitionURI);
	var CognitionsURI = express.Router();
	CognitionsURI.post("/",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("Solo se aceptan caracteres alphabeticos");
		}
		if(!Validator.isAlphanumeric()(request.body.category)){
			throw new ValidatorException("Solo se aceptan categorias validas");
		}
		category.find({_id:request.body.category}).then(function(cat){
			return cognition.add({
				name:request.body.name,
				category:cat
			});
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	CognitionsURI.get("/",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);		
		cognition.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	CognitionsURI.get("/:name",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);			
		cognition.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	CognitionsURI.put("/:name",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(!Validator.isAlpha()(request.body.name)){
			throw new ValidatorException("Solo se aceptan caracteres alphabeticos");
		}
		if(!Validator.isAlphanumeric()(request.body.category)){
			throw new ValidatorException("Solo se aceptan categorias validas");
		}
		category.find({_id:request.body.category}).then(function(cat){
			return cognition.update({_id:request.params.name},function(obj){
				obj.name=request.body.name;
				obj.category=cat;
				return obj;
			});
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});		
	});
	CognitionsURI.delete("/:name",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);
		cognition.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/cognitions",CognitionsURI);
}