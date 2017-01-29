var Grade=require("./SoulHand/Grade.js");
var Course=require("./SoulHand/Course.js");
var Period=require("./SoulHand/Period.js");
var People=require("./SoulHand/People.js");
var SubPeople=require("./SoulHand/SubPeople.js");
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
	var PeopleURI = express.Router();
	PeopleURI.post("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Teachers);
		var people2=new People(app.container.database.Schema.Peoples);
		if(!Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(!Validator.isDate()(request.body.birthDate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		var fields={
			data:JSON.parse(JSON.stringify(request.body)),
			interprete:(request.body.interprete!=undefined)
		};
		delete(fields.data.interprete);
		people2.add(fields.data).then(function(data){
			fields.data=data;
			return people.add(fields);
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	PeopleURI.get("/",function(request, response,next) {
		var people=new People(app.container.database.Schema.Teachers);		
		people.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	PeopleURI.get("/:name",function(request, response,next) {
		var people=new People(app.container.database.Schema.Teachers);			
		people.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	PeopleURI.put("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Teachers);
		var people2=new People(app.container.database.Schema.Peoples);
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthDate && !Validator.isDate()(request.body.birthDate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		people.update({_id:request.params.name},function(obj){
			for (i in obj.data){
				if(request.body[i] && i!="dni"){
					obj.data[i]=request.body[i];
				}
			}
			obj.interprete=(request.body.interprete!=undefined);
			return obj;
		}).then(function(data){
			return people2.find({_id:data.data._id});
		}).then(function(data){
			for (i in data){
				if(request.body[i] && i!="dni"){
					data[i]=request.body[i];
				}
			}			
			return data.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	PeopleURI.delete("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Teachers);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.name}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/teachers",PeopleURI);
	var StudentsURI = express.Router();
	StudentsURI.post("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		var grade=new Grade(app.container.database.Schema.Grades);
		if(!Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(!Validator.isDate()(request.body.birthDate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		var fields={
			data:JSON.parse(JSON.stringify(request.body)),
			grade:request.body.grade,
			activities:[],
			conflicts:[],
			habilitys:[]
		};
		delete(fields.data.interprete);
		delete(fields.data.grade);
		grade.find({name:request.body.grade}).then(function(data){
			fields.grade=data;
			return people2.add(fields.data);
		}).then(function(data){
			fields.data=data;
			return people.add(fields);
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	StudentsURI.get("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	StudentsURI.get("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	StudentsURI.put("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		var grade=new Grade(app.container.database.Schema.Grades);
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthDate && !Validator.isDate()(request.body.birthDate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		var promise1;
		if(request.body.grade){
			promise1=grade.find({name:request.body.grade}).then(function(data){
				request.body.grade=data;
				return people.update({_id:request.params.name},function(obj){
					for (i in obj.data){
						if(request.body[i] && i!="dni"){
							obj.data[i]=request.body[i];
						}
					}
					obj.grade=request.body.grade;
					return obj;
				})
			});
		}else{
			promise1=people.update({_id:request.params.name},function(obj){
				for (i in obj.data){
					if(request.body[i] && i!="dni"){
						obj.data[i]=request.body[i];
					}
				}
				return obj;
			});
		}
		promise1.then(function(data){
			return people2.find({_id:data.data._id});
		}).then(function(data){
			for (i in data){
				if(request.body[i] && i!="dni"){
					data[i]=request.body[i];
				}
			}			
			return data.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	StudentsURI.delete("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.name}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/students",StudentsURI);
}