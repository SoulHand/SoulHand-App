var Grade=require("./SoulHand/Grade.js");
var Course=require("./SoulHand/Course.js");
var Period=require("./SoulHand/Period.js");
var People=require("./SoulHand/People.js");
var Activities=require("./SoulHand/Activities.js");
var SubPeople=require("./SoulHand/SubPeople.js");
var Cognitions=require("./SoulHand/Cognitions.js");
var Habilities=require("./SoulHand/Habilities.js");
var ConflictCognitions=require("./SoulHand/ConflictCognitions.js");
var CategoryCoginitions=require("./SoulHand/CategoryCoginitions.js");
var User=require("./SoulHand/User.js");
var Validator=require('string-validator');
var ValidatorException=require('./SoulHand/Exceptions/ValidatorException.js');

module.exports=function(app,express,server,__DIR__){
	/*
	* Ruta /v1/grades
	* @var gradeURI object enrutador para agrupar metodos
	*/
	var gradeURI = express.Router();
	/*
	* POST / Crear grado
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.post("/",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		grade.add(request.body.name).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET / Obtener todos los grados
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.get("/",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);		
		grade.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un grado especifico
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.get("/:name",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);			
		grade.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar un grado
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.put("/:name",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		if(Validator.isNull()(request.body.name)){
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
	/*
	* DELETE /:name Eliminar un grado
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.delete("/:name",function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);		
		grade.remove({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/grades",gradeURI);
	/*
	* Ruta /v1/habilities
	* @var HabilitiesURI object enrutador para agrupar metodos
	*/
	var HabilitiesURI = express.Router();
	/*
	* POST / Crear habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var hability<Habilities>	objeto CRUD
	*/
	HabilitiesURI.post("/",function(request, response,next) {
		var hability=new Habilities(app.container.database.Schema.Habilities);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		var field={
			name:request.body.name,
			cognitions:[]
		};
		hability.add(field).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET / Obtener todas las habilidades
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var hability<Habilities>	objeto CRUD
	*/
	HabilitiesURI.get("/",function(request, response,next) {
		var hability=new Habilities(app.container.database.Schema.Habilities);		
		hability.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener una habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var hability<Habilities>	objeto CRUD
	*/
	HabilitiesURI.get("/:name",function(request, response,next) {
		var hability=new Habilities(app.container.database.Schema.Habilities);			
		hability.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var hability<Habilities>	objeto CRUD
	*/
	HabilitiesURI.put("/:name",function(request, response,next) {
		var hability=new Habilities(app.container.database.Schema.Habilities);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		hability.update({_id:request.params.name},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* DELETE /:name Eliminar una habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var hability<Habilities>	objeto CRUD
	*/
	HabilitiesURI.delete("/:name",function(request, response,next) {
		var grade=new Habilities(app.container.database.Schema.Habilities);
		grade.remove({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/habilities",HabilitiesURI);
	/*
	* Ruta /v1/activities
	* @var ActivitiesURI object enrutador para agrupar metodos
	*/
	var ActivitiesURI = express.Router();
	/*
	* POST / Crear Actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var grade<Activities>	objeto CRUD
	* @var people<SubPeople>	objeto CRUD
	* @var course<Course>	objeto CRUD
	*/
	ActivitiesURI.post("/",function(request, response,next) {
		var grade= new Activities(app.container.database.Schema.Activities);
		var people= new SubPeople(app.container.database.Schema.Teachers);
		var course= new Course(app.container.database.Schema.Courses);
		var min=parseInt(request.body.minDate);
		var max=parseInt(request.body.maxDate);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		if(!Validator.isInt()(request.body.minDate) || min<3 || min>=150){
			throw new ValidatorException("La edad minima no es aceptada");
		}
		if(!Validator.isInt()(request.body.maxDate) || max>150 || max <=3){
			throw new ValidatorException("La edad máxima no es aceptada");
		}
		if((max-min)<=0){
			throw new ValidatorException("El rango entre las edades debe ser mayor a cero");
		}
		var field={
			name:request.body.name,
			TeacherCreate:null,
			course:null,
			range:{
				level:0,
				min:min,
				max:max
			},
			conflicts:[],
			habilitys:[]
		};
		people.find({"data.dni":request.body.teacher}).then(function(teacher){
			field.TeacherCreate=teacher;
			return course.find({_id:request.body.course});
		}).then(function(course){
			field.course=course;
			return grade.add(field);			
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET / Obtener todas las actividades
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var activity<Activities>	objeto CRUD
	*/
	ActivitiesURI.get("/",function(request, response,next) {
		var activity=new Activities(app.container.database.Schema.Activities);
		activity.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener una actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var activity<Activities>	objeto CRUD
	*/
	ActivitiesURI.get("/:name",function(request, response,next) {
		var activity= new Activities(app.container.database.Schema.Activities);			
		activity.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var activity<Activities>	objeto CRUD
	* @var people<SubPeople>	objeto CRUD
	* @var course<Course>	objeto CRUD
	*/
	ActivitiesURI.put("/:name",function(request, response,next) {
		var activity= new Activities(app.container.database.Schema.Activities);
		var people= new SubPeople(app.container.database.Schema.Teachers);
		var course= new Course(app.container.database.Schema.Courses);
		
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		if(request.body.max){
			var max=parseInt(request.body.max);
			console.log(max>150 || max <=3);
			if(!Validator.isInt()(request.body.max) || max>150 || max <=3){
				throw new ValidatorException("La edad máxima no es aceptada");
			}
			request.body.max=max;
		}
		if(request.body.min){
			var min=parseInt(request.body.min);
			if(!Validator.isInt()(request.body.min) || min<3 || min>=150){
				throw new ValidatorException("La edad minima no es aceptada");
			}
			request.body.min=min;
		}
		if(request.body.max && request.body.min){
			if((request.body.max-request.body.min)<=0){
				throw new ValidatorException("El rango entre las edades debe ser mayor a cero");
			}
		}
		var promise1;
		if(request.body.course){			
			promise1=course.find({_id:request.body.course}).then(function(course){
				request.body.course=course;
				return activity.update({_id:request.params.name},function(obj){					
					if(!request.body.max || !request.body.min){
						if(request.body.max && (request.body.max-obj.range.min)<=0){
							throw new ValidatorException("El rango ingresado es menor al sistema");
						}
						if(request.body.min && (obj.range.max-request.body.min)<=0){
							throw new ValidatorException("El rango entre las edades debe ser mayor a cero");
						}
					}
					for (i in obj){
						if(typeof obj[i]=="object" && Object.keys(obj[i]).length>0 && i!="TeacherCreate" && i!="conflicts" && i!="habilitys" && i!="course"){
							for(j in obj[i]){
								if(request.body[j]){
									obj[i][j]=request.body[j];																		
								}									
							}
						}else{
							if(request.body[i] && i!="TeacherCreate" && i!="conflicts" && i!="habilitys"){
								obj[i]=request.body[i];								
							}
						}
					}
					return obj;
				})
			});
		}else{
			promise1=activity.update({_id:request.params.name},function(obj){				
				if(!request.body.max || !request.body.min){
					if(request.body.max && (request.body.max-obj.range.min)<=0){
						throw new ValidatorException("El rango ingresado es menor al sistema");
					}
					if(request.body.min && (obj.range.max-request.body.min)<=0){
						throw new ValidatorException("El rango entre las edades debe ser mayor a cero");
					}
				}
				for (i in obj){
					if(typeof obj[i]=="object" && Object.keys(obj[i]).length>0 && i!="TeacherCreate" && i!="conflicts" && i!="habilitys" && i!="course"){
						for(j in obj[i]){
							if(request.body[j]){
								obj[i][j]=request.body[j];																		
							}									
						}
					}else{
						if(request.body[i] && i!="TeacherCreate" && i!="conflicts" && i!="habilitys"){
							obj[i]=request.body[i];								
						}
					}
				}
				return obj;
			});
		}
		promise1.then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});		
	});
	/*
	* DELETE /:name Eliminar una actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var activity<Activities>	objeto CRUD
	*/
	ActivitiesURI.delete("/:name",function(request, response,next) {
		var activity=new Activities(app.container.database.Schema.Activities);
		activity.remove({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/activities",ActivitiesURI);
	/*
	* Ruta /v1/conflicts
	* @var ConflictCognitionsURI object enrutador para agrupar metodos
	*/
	var ConflictCognitionsURI = express.Router();
	/*
	* POST / Crear Conflicto Cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var conflict<Habilities>	objeto CRUD
	*/
	ConflictCognitionsURI.post("/",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		var field={
			name:request.body.name,
			cognitions:[]
		};
		conflict.add(field).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET / Obtener todas los conflictos cognitivos
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var conflict<Habilities>	objeto CRUD
	*/
	ConflictCognitionsURI.get("/",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);		
		conflict.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un conflicto cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var conflict<Habilities>	objeto CRUD
	*/
	ConflictCognitionsURI.get("/:name",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);			
		conflict.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar conflicto cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var conflict<Habilities>	objeto CRUD
	*/
	ConflictCognitionsURI.put("/:name",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		conflict.update({_id:request.params.name},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* DELETE /:name Eliminar un conflicto cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var activity<Activities>	objeto CRUD
	*/
	ConflictCognitionsURI.delete("/:name",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);
		conflict.remove({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/conflicts",ConflictCognitionsURI);
	/*
	* Ruta /v1/courses
	* @var courseURI object enrutador para agrupar metodos
	*/
	var courseURI = express.Router();
	/*
	* POST / Crear materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var course<Course>	objeto CRUD
	*/
	courseURI.post("/",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		course.add(request.body.name).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET / Obtener todas las materias
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var course<Course>	objeto CRUD
	*/
	courseURI.get("/",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);		
		course.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener una materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var course<Course>	objeto CRUD
	*/
	courseURI.get("/:name",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);			
		course.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var course<Course>	objeto CRUD
	*/
	courseURI.put("/:name",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		if(Validator.isNull()(request.body.name)){
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
	/*
	* DELETE /:name Eliminar una materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var course<Course>	objeto CRUD
	*/
	courseURI.delete("/:name",function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		course.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/courses",courseURI);
	/*
	* Ruta /v1/periods
	* @var periodURI object enrutador para agrupar metodos
	*/
	var periodURI = express.Router();
	/*
	* POST / Crear periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var period<Period>	objeto CRUD
	*/
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
	/*
	* GET / Obtener todos los periodos escolares
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var period<Period>	objeto CRUD
	*/
	periodURI.get("/",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);		
		period.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var period<Period>	objeto CRUD
	*/
	periodURI.get("/:name",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);			
		period.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var period<Period>	objeto CRUD
	*/
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
	/*
	* DELETE /:name Eliminar un periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var period<Period>	objeto CRUD
	*/
	periodURI.delete("/:name",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		period.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/periods",periodURI);
	/*
	* Ruta /v1/category/cognitions
	* @var categoryCognitionURI object enrutador para agrupar metodos
	*/
	var categoryCognitionURI = express.Router();
	/*
	* POST / Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	categoryCognitionURI.post("/",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		category.add(request.body.name.toUpperCase()).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	categoryCognitionURI.get("/",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);		
		category.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	categoryCognitionURI.get("/:name",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);			
		category.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	categoryCognitionURI.put("/:name",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		category.update({_id:request.params.name.toUpperCase()},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* DELETE /:name Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	categoryCognitionURI.delete("/:name",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		category.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/category/cognitions",categoryCognitionURI);
	/*
	* Ruta /v1/cognitions
	* @var CognitionsURI object enrutador para agrupar metodos
	*/
	var CognitionsURI = express.Router();
	/*
	* POST / Crear funcion cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var category<CategoryCoginitions> objeto CRUD
	* @var cognition<Cognitions> objeto CRUD
	*/
	CognitionsURI.post("/",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan caracteres alphabeticos");
		}
		if(Validator.isNull()(request.body.category)){
			throw new ValidatorException("Solo se aceptan categorias validas");
		}
		category.find({name:request.body.category.toUpperCase()}).then(function(cat){
			return cognition.add({
				name:request.body.name.toUpperCase(),
				category:cat
			});
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET / Obtener todas las funciones cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var cognition<Cognitions>	objeto CRUD
	*/
	CognitionsURI.get("/",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);		
		cognition.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener una funcion cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var cognition<Cognitions>	objeto CRUD
	*/
	CognitionsURI.get("/:name",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);			
		cognition.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /category/:name Obtener las funcion cognitiva correspondientes a una categoria
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var cognition<Cognitions>	objeto CRUD
	*/
	CognitionsURI.get("/category/:name",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);			
		cognition.get({"category.name":request.params.name.toUpperCase()}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar funcion cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var cognition<Cognitions>	objeto CRUD
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	CognitionsURI.put("/:name",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan caracteres alphabeticos");
		}
		if(Validator.isNull()(request.body.category)){
			throw new ValidatorException("Solo se aceptan categorias validas");
		}
		category.find({name:request.body.category.toUpperCase()}).then(function(cat){
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
	/*
	* DELETE /:name Eliminar una funcion cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var cognition<Cognitions>	objeto CRUD
	*/
	CognitionsURI.delete("/:name",function(request, response,next) {
		var cognition=new Cognitions(app.container.database.Schema.Cognitions);
		cognition.remove({_id:request.params.name}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/cognitions",CognitionsURI);
	/*
	* Ruta /v1/teachers
	* @var PeopleURI object enrutador para agrupar metodos
	*/
	var PeopleURI = express.Router();
	/*
	* POST / Crear profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*/
	PeopleURI.post("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Teachers);
		var people2=new People(app.container.database.Schema.Peoples);
		if(!Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(!Validator.isDate()(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		var fields={
			data:JSON.parse(JSON.stringify(request.body)),
			interprete:(request.body.interprete!=undefined)
		};
		fields.data.mode="TEACHER";
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
	/*
	* GET / Obtener todos los docentes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<People>	objeto CRUD
	*/
	PeopleURI.get("/",function(request, response,next) {
		var people=new People(app.container.database.Schema.Teachers);		
		people.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<People>	objeto CRUD
	*/
	PeopleURI.get("/:name",function(request, response,next) {
		var people=new People(app.container.database.Schema.Teachers);			
		people.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	PeopleURI.put("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Teachers);
		var people2=new People(app.container.database.Schema.Peoples);
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthdate && !Validator.isDate()(request.body.birthDate)){
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
	/*
	* DELETE /:name Eliminar un profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
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
	/*
	* Ruta /v1/students
	* @var StudentsURI object enrutador para agrupar metodos
	*/
	var StudentsURI = express.Router();
	/*
	* POST / Crear alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*/
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
		fields.data.mode="STUDENT";		
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
	/*
	* GET / Obtener todos los alumnos
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<People>	objeto CRUD
	*/
	StudentsURI.get("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	*/
	StudentsURI.get("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
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
	/*
	* DELETE /:name Eliminar un alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
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
	/*
	* Ruta /v1/representives		
	* @var ReferencesToURI object enrutador para agrupar metodos
	*/
	var ReferencesToURI = express.Router();
	/*
	* POST / Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople> objeto CRUD
	* @var people3<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*/
	ReferencesToURI.post("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		var people3=new SubPeople(app.container.database.Schema.Students);
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
			idStudent:request.body.idStudent			
		};
		fields.data.mode="PARENT";
		delete(fields.data.idStudent);
		people3.find({"data.dni":request.body.idStudent}).then(function(data){
			fields.idStudent=data._id;
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
	/*
	* GET / Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	*/
	ReferencesToURI.get("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	*/
	ReferencesToURI.get("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	* @var grade<Grade>	objeto CRUD
	*/
	ReferencesToURI.put("/:name",function(request, response,next) {
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
	/*
	* DELETE /:name Eliminar un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	ReferencesToURI.delete("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.name}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/representives",ReferencesToURI);/*
	* Ruta /v1/representives		
	* @var ReferencesToURI object enrutador para agrupar metodos
	*/
	var ReferencesToURI = express.Router();
	/*
	* POST / Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople> objeto CRUD
	* @var people3<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*/
	ReferencesToURI.post("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		var people3=new SubPeople(app.container.database.Schema.Students);
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
			idStudent:request.body.idStudent			
		};
		delete(fields.data.idStudent);
		people3.find({"data.dni":request.body.idStudent}).then(function(data){
			fields.idStudent=data._id;
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
	/*
	* GET / Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	*/
	ReferencesToURI.get("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	*/
	ReferencesToURI.get("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		people.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	* @var grade<Grade>	objeto CRUD
	*/
	ReferencesToURI.put("/:name",function(request, response,next) {
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
	/*
	* DELETE /:name Eliminar un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	ReferencesToURI.delete("/:name",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.name}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/representives",ReferencesToURI);
	/*
	* Ruta /v1/users		
	* @var UsersURI object enrutador para agrupar metodos
	*/
	var UsersURI = express.Router();
	/*
	* POST / Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var user<User>	objeto CRUD
	* @var people<SubPeople> objeto CRUD
	*/
	UsersURI.post("/",function(request, response,next) {
		var user=new User(app.container.database.Schema.User);
		var people=new People(app.container.database.Schema.Peoples);
		if(!Validator.matches(/^[VE][0-9]{6,9}$/)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");			
		}
		if(!Validator.isAlphanumeric()(request.body.username)){
			throw new ValidatorException("Es necesario un nombre de usuario valido");			
		}
		if(!Validator.isEmail()(request.body.email)){
			throw new ValidatorException("Es necesario un email valido");			
		}
		if(!Validator.isLength(5,14)(request.body.password)){
			throw new ValidatorException("Es necesario una contraseña de por lo menos 5 caracteres");			
		}
		const base64=require('base-64');
		var fields={
			username:request.body.username,
			email:request.body.email,
			password:base64.encode(request.body.password),
			people:null
		};
		people.find({dni:request.body.dni}).then(function(data){
			fields.people=data;
			return user.add(fields);
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			if(error.code=="100"){
				error.setMessage("No existe en el registro del personal");
			}
			next(error);
		});
	});
	/*
	* GET / Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var user<User>	objeto CRUD
	*/
	UsersURI.get("/",function(request, response,next) {
		var user=new User(app.container.database.Schema.User);
		user.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* GET /:name Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var user<User>	objeto CRUD
	*/
	UsersURI.get("/:name",function(request, response,next) {
		var user=new User(app.container.database.Schema.User);
		user.find({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* PUT /:name Editar representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var user<User>	objeto CRUD
	*/
	UsersURI.put("/:name",function(request, response,next) {
		if(request.body.isAdmin){
			throw new ValidatorException("no puede realizar un cambio de administración");
		}
		if(request.body.dni){
			throw new ValidatorException("No puede alterar un documento de identidad");			
		}
		if(request.body.username && !Validator.isAlphanumeric()(request.body.username)){
			throw new ValidatorException("Es necesario un nombre de usuario valido");			
		}
		if(request.body.email && !Validator.isEmail()(request.body.email)){
			throw new ValidatorException("Es necesario un email valido");			
		}
		if(request.body.password && !Validator.isLength(5,14)(request.body.password)){
			throw new ValidatorException("Es necesario una contraseña de por lo menos 5 caracteres");			
		}
		if(request.body.password){
			const base64=require('base-64');
			request.body.password=base64.encode(request.body.password);
		}
		var user=new User(app.container.database.Schema.User);
		user.update({_id:request.params.name},function(data){
			for (i in data){
				if(request.body[i] && i!='people'){
					data[i]=request.body[i];
				}
			}
			return data;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* DELETE /:name Eliminar un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion	
	* @var user<User>	objeto CRUD
	*/
	UsersURI.delete("/:name",function(request, response,next) {
		var user=new User(app.container.database.Schema.User);
		user.remove({_id:request.params.name}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});		
	});
	app.use("/v1/users",UsersURI);
}