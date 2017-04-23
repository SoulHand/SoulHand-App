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
var CRUD=require("./SoulHand/CRUD.js");
var User=require("./SoulHand/User.js");
var Token=require("./SoulHand/Token.js");
var Validator=require('string-validator');
var ValidatorException=require('./SoulHand/Exceptions/ValidatorException.js');
var VoidException=require('./SoulHand/Exceptions/VoidException.js');
var UserException=require('./SoulHand/Exceptions/UserException.js');
var basicAuth = require('basic-auth-connect');
var Auth = require('./SoulHand/Auth.js');

module.exports=function(app,express,server,__DIR__){
	var Events = require('./SoulHand/inferencia/events.js')(app.container.database.Schema);
	/*
	* Ruta /v1/grades
	* @var gradeURI object enrutador para agrupar metodos
	*/
	var gradeURI = express.Router();
	/*
	* @api {post} / Crear grado
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		grade.add(request.body.name.toString()).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todos los grados
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.get("/",function(request, response,next) {
		app.container.database.Schema.Grades.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un grado especifico
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.get("/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.Grades.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el grado!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar un grado
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras o numeros");
		}
		grade.update({_id:request.params.id},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un grado
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var grade<Grade>	objeto CRUD
	*/
	gradeURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var grade=new Grade(app.container.database.Schema.Grades);
		grade.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/grades",gradeURI);

	/*
	* Ruta /v1/courses
	* @var courseURI object enrutador para agrupar metodos
	*/
	var courseURI = express.Router();
	/*
	* @api {post} / Crear materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var course<Course>	objeto CRUD
	*/
	courseURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
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
	* @api {get} / Obtener todas las materias
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var course<Course>	objeto CRUD
	*/
	courseURI.get("/",function(request, response,next) {
		app.container.database.Schema.Courses.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener una materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var course<Course>	objeto CRUD
	*/
	courseURI.get("/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.Courses.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe la materia!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var course<Course>	objeto CRUD
	*/
	courseURI.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		course.update({_id:request.params.id},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una materia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var course<Course>	objeto CRUD
	*/
	courseURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var course=new Course(app.container.database.Schema.Courses);
		course.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/courses",courseURI);

	/*
	* Ruta /v1/learning
	* @var learningURI object enrutador para agrupar metodos
	*/
	var learningURI = express.Router();
	/*
	* Ruta /v1/learning/domain

	* @api {post} / Crear dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	learningURI.post("/domain/",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		category.add(request.body.name.toUpperCase(),request.body).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas los dominios del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	learningURI.get("/domain/",function(request, response,next) {
		app.container.database.Schema.domainsLearning.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener un dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	learningURI.get("/domain/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.domainsLearning.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el dominio!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	learningURI.put("/domain/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		if(request.body.name && Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		if(request.body.description && Validator.isNull()(request.body.description)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		category.update({_id:request.params.id},function(row){
			for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
				if(request.body[keys[i]]){
					row[keys[i]]=request.body[keys[i]];
				}
			}
			return row;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	learningURI.delete("/domain/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		category.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/learning",learningURI);

	/*
	* Ruta /v1/knowedge
	* @var cognitions object enrutador para agrupar metodos
	*/
	var cognitions = express.Router();
	/*
	* @api {post} / Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	cognitions.post("/:domain/cognitions",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var domain=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		if(Validator.isNull()(request.body.description)){
			throw new ValidatorException("Es necesario una breve descripción");
		}
		if(Validator.isNull()(request.params.domain)){
			throw new ValidatorException("Solo se aceptan dominios validos");
		}
		domain.find({name:request.params.domain.toUpperCase()}).then(function(row){
			row.cognitions.push(app.container.database.Schema.Cognitions({
				name:request.body.name.toUpperCase(),
				description:request.body.description.toUpperCase()
			}));
			return row.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.get("/:domain/cognitions",function(request, response,next) {
		if(Validator.isNull()(request.params.domain)){
			throw new ValidatorException("Solo se aceptan dominios validos");
		}
		app.container.database.Schema.domainsLearning.findOne({name:request.params.domain.toUpperCase()}).then(function(row){
			if(!row){
				throw new ValidatorException("No existe el dominio!");
			}
			response.send(row.cognitions);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.get("/:domain/cognitions/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id no es valido!");
		}
		app.container.database.Schema.domainsLearning.findOne({name:request.params.domain.toUpperCase()}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el dominio!");
			}
			for (var i=0,n=data.cognitions.length;i<n;i++){
				if(data.cognitions[i]._id==request.params.id){
					response.send(data.cognitions[i]);
					return;
				}
			}
			throw new VoidException("No existe la función cognitiva!");
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.put("/:domain/cognitions/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		if(!Validator.isNull()(request.body.words)){
			throw new ValidatorException("Este campo no es valido!");
		}
		category.update({name:request.params.domain.toUpperCase()},function(obj){
			var findElement=false;
			obj.cognitions=obj.cognitions.map(function(row){
				if(request.params.id==row._id){
					findElement=true;
					for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
						if(request.body[keys[i]]){
							row[keys[i]]=request.body[keys[i]];
						}
					}
				}
				return row;
			});
			if(!findElement){
				throw VoidException("No existe el registro!");
			}
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.delete("/:domain/cognitions/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		category.update({name:request.params.domain.toUpperCase()},function(obj){
			for(i in obj.cognitions){
				if(obj.cognitions[i]._id==request.params.id){
					obj.cognitions[i].remove();
					break;
				}
			}
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} / Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	cognitions.post("/:domain/level/",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var domain=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		if(!Validator.isNumeric()(request.body.level)){
			throw new ValidatorException("El nivel es numerico");
		}
		domain.find({name:request.params.domain.toUpperCase()}).then(function(row){
			var level= new app.container.database.Schema.nivelDomain({
				name:request.body.name.toUpperCase(),
				level:request.body.level
			});
			row.levels.forEach((row)=>{
				if(row.level==level.level || row.name == level.name){
					throw new ValidatorException("ya existe un registro con similares descripciones!");
				}
			});
			row.levels.push(level);
			return row.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.get("/:domain/level/",function(request, response,next) {
		var domain=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		if(Validator.isNull()(request.params.domain)){
			throw new ValidatorException("Solo se aceptan dominios validos");
		}
		domain.find({name:request.params.domain.toUpperCase()}).then(function(row){
			response.send(row.levels);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.get("/:domain/level/:id",function(request, response,next) {
		var domain=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id no es valido!");
		}
		domain.find({name:request.params.domain.toUpperCase()}).then(function(data){
			for (var i=0,n=data.levels.length;i<n;i++){
				if(data.levels[i]._id==request.params.id){
					response.send(data.levels[i]);
					return;
				}
			}
			throw new VoidException("No existe un resultado!");
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.delete("/:domain/level/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		category.update({name:request.params.domain.toUpperCase()},function(obj){
			for(i in obj.levels){
				if(obj.levels[i]._id==request.params.id){
					obj.levels[i].remove();
					break;
				}
			}
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});

	/*
	* @api {post} /:domain/objetives/:type Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	cognitions.post("/:domain/objetives/:level",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var domain=new CategoryCoginitions(app.container.database.Schema.domainsLearning);
		var dm;
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Es requerido un nombre");
		}
		if(Validator.isNull()(request.body.description)){
			throw new ValidatorException("Es necesaria una description");
		}
		request.params.level=request.params.level.toUpperCase();
		domain.find({name:request.params.domain.toUpperCase()}).then(function(row){
			dm=row;
			for(var i in row.levels){
				if(row.levels[i].name ==request.params.level){
					return row.levels[i];
				}
			}
			throw new ValidatorException("No existe el nivel de aprendizaje");
		}).then(function(data){
			var p1=new app.container.database.Schema.LearningObjetive({
				name:request.body.name,
				description:request.body.description,
				domain:{
					_id:dm._id,
					name:dm.name
				},
				level:{
					_id:data._id,
					name:data.name
				}
			});
			return p1.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.get("/:domain/objetives/:level",function(request, response,next) {
		app.container.database.Schema.LearningObjetive.find({"domain.name":request.params.domain.toString(),"level.name":request.params.level.toString()}).then(function(rows){
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.get("/:domain/objetives/:level/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.LearningObjetive.findOne({"domain.name":request.params.domain.toString(),"level.name":request.params.level.toString(), _id:request.params.id }).then(function(rows){
			if(!rows){
				throw new Validator("No existe el objetivo de aprendizaje");
			}
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});

	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.put("/:domain/objetives/:level/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.LearningObjetive.findOne({"domain.name":request.params.domain.toString(),"level.name":request.params.level.toString(), _id:request.params.id }).then(function(rows){
			for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
				if(request.body[keys[i]]){
					row[keys[i]]=request.body[keys[i]];
				}
			}
			return row.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.put("/:domain/objetives/:level/:id/cognitions/:cognition",Auth.isAdmin.bind(app.container),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)|| !Validator.isMongoId()(request.params.cognition)){
			throw new ValidatorException("El id es invalido!");
		}
		Promise.all([app.container.database.Schema.LearningObjetive.findOne({"domain.name":request.params.domain.toString(),"level.name":request.params.level.toString(), _id:request.params.id }),app.container.database.Schema.domainsLearning.findOne({name:request.params.domain.toUpperCase()})]).then(function(row){
			if(!row[0]){
				throw new ValidatorException("No existe el objetivo!");
			}
			if(!row[1]){
				throw new ValidatorException("No existe el dominio!");
			}
			for(var i in row[1].cognitions){
				if(row[1].cognitions[i]._id==request.params.cognition){
					row[0].cognitions.push(row[1].cognitions[i]);
					return row[0].save();
				}
			}
			throw new ValidatorException("No existe la funcion cognitiva!");
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});

	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	cognitions.delete("/:domain/objetives/:level/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.LearningObjetive.findOne({"domain.name":request.params.domain.toString(),"level.name":request.params.level.toString(), _id:request.params.id }).then(function(obj){
			return obj.remove();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/knowedge",cognitions);

	var weightURI = express.Router();
	/*
	* Ruta /v1/physic/static/weight

	* @api {post} / Crear dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	weightURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CRUD(app.container.database.Schema.weights);
		if(!Validator.isFloat()(request.body.height) || !Validator.isFloat()(request.body.min) || !Validator.isFloat()(request.body.max)){
			throw new ValidatorException("Solo se aceptan numeros");
		}
		if((request.body.max-request.body.min)<=0 || request.body.min==0 || request.body.max==0){
			throw new ValidatorException("El rango de pesos es invalido");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var genero=request.body.genero.toUpperCase();
		category.add({height:request.body.height,genero:genero},{
			height:request.body.height,
			min:request.body.min,
			max:request.body.max,
			genero:genero
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas los dominios del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	weightURI.get("/",function(request, response,next) {
		app.container.database.Schema.weights.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener un dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	weightURI.get("/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("EL id no es valido");
		}
		app.container.database.Schema.weights.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el peso!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	weightURI.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.weights);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("EL id no es valido");
		}
		if((request.body.height && !Validator.isFloat()(request.body.height)) || (request.body.min && !Validator.isFloat()(request.body.min)) || (request.body.max && !Validator.isFloat()(request.body.max))){
			throw new ValidatorException("Solo se aceptan numeros");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		category.update({_id:request.params.id},function(row){
			if(request.body.max && request.body.min && ((request.body.max-request.body.min)<=0 || request.body.min==0 || request.body.max==0)){
				throw new ValidatorException("El rango de pesos es invalido");
			}
			if(request.body.max && ((request.body.max-row.min)<=0 || row.min==0 || request.body.max==0)){
				throw new ValidatorException("El rango máximo no es valido con el minimo existente!");
			}
			if(request.body.max && ((row.max-request.body.min)<=0 || request.body.min==0 || row.max==0)){
				throw new ValidatorException("El rango mínimo no es valido con el máximo existente!");
			}
			for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
				if(request.body[keys[i]]){
					row[keys[i]]=request.body[keys[i]];
				}
			}
			return row;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	weightURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.weights);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("EL id no es valido");
		}
		category.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/physic/static/weight",weightURI);

	var heightURI = express.Router();
	/*
	* Ruta /v1/physic/static/height

	* @api {post} / Crear dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	heightURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CRUD(app.container.database.Schema.heights);
		if(!Validator.isFloat()(request.body.age) || !Validator.isFloat()(request.body.min) || !Validator.isFloat()(request.body.max)){
			throw new ValidatorException("Solo se aceptan numeros");
		}
		if((request.body.max-request.body.min)<=0 || request.body.min==0 || request.body.max==0){
			throw new ValidatorException("El rango de pesos es invalido");
		}
		if(request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var genero=request.body.genero.toUpperCase();
		category.add({age:request.body.age,genero:genero},{
			age:request.body.age,
			min:request.body.min,
			max:request.body.max,
			genero:genero
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas los dominios del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	heightURI.get("/",function(request, response,next) {
		app.container.database.Schema.heights.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener un dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	heightURI.get("/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("EL id no es valido");
		}
		app.container.database.Schema.heights.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe la altura!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	heightURI.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.heights);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("EL id no es valido");
		}
		if((request.body.age && !Validator.isFloat()(request.body.age)) || (request.body.min && !Validator.isFloat()(request.body.min)) || (request.body.max && !Validator.isFloat()(request.body.max))){
			throw new ValidatorException("Solo se aceptan numeros");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		category.update({_id:request.params.id},function(row){
			if(request.body.max && request.body.min && ((request.body.max-request.body.min)<=0 || request.body.min==0 || request.body.max==0)){
				throw new ValidatorException("El rango de pesos es invalido");
			}
			if(request.body.max && ((request.body.max-row.min)<=0 || row.min==0 || request.body.max==0)){
				throw new ValidatorException("El rango máximo no es valido con el minimo existente!");
			}
			if(request.body.max && ((row.max-request.body.min)<=0 || request.body.min==0 || row.max==0)){
				throw new ValidatorException("El rango mínimo no es valido con el máximo existente!");
			}
			for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
				if(request.body[keys[i]]){
					row[keys[i]]=request.body[keys[i]];
				}
			}
			return row;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	heightURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.heights);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("EL id no es valido");
		}
		category.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/physic/static/height",heightURI);

	/*
	* Ruta /v1/users
	* @var UsersURI object enrutador para agrupar metodos
	*/
	var UsersURI = express.Router();
	/*
	* @api {post} / Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var user<User>	objeto CRUD
	* @var people<SubPeople> objeto CRUD
	*/
	UsersURI.post("/",function(request, response,next) {
		var user=new User(app.container.database.Schema.User);
		var people=new People(app.container.database.Schema.Peoples);
		request.body.dni=request.body.dni.toUpperCase();
		if(!Validator.matches(/^[VE][0-9]{6,9}$/)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(Validator.isNull()(request.body.username)){
			throw new ValidatorException("Es necesario un nombre de usuario valido");
		}
		if(!Validator.isEmail()(request.body.email)){
			throw new ValidatorException("Es necesario un email valido");
		}
		if(!Validator.isLength(5,14)(request.body.password)){
			throw new ValidatorException("Es necesario una contraseña de por lo menos 5 caracteres");
		}
		var fields={
			username:request.body.username,
			email:request.body.email,
			password:request.body.password,
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
	* @api {get} / Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var user<User>	objeto CRUD
	*/
	UsersURI.get("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
		app.container.database.Schema.User.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var user<User>	objeto CRUD
	*/
	UsersURI.get("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		app.container.database.Schema.User.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el usuario!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var user<User>	objeto CRUD
	*/
	UsersURI.put("/root/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var user=new User(app.container.database.Schema.User);
		user.update({_id:request.params.id},function(data){
			data.isAdmin=(!request.body.isAdmin || request.body.isAdmin=="false") ? false : true;
			return data;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});

	UsersURI.put("/:id",Auth.isUser.bind(app.container),function(request, response,next) {
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
		var USER;
		var user=new User(app.container.database.Schema.User);
		app.container.database.Schema.User.findOne({_id:request.params.id}).then(function(row){
			if(!row){
				throw new VoidException("No existe el registro");
			}
			if(request.user.isAdmin!=true && data._id!=request.user._id){
				throw new ValidatorException("No tiene permisos para editar este registro");
			}
			for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
				if(request.body[keys[i]] && keys[i]!="dni"){
					row[keys[i]]=request.body[keys[i]];
				}
			}
			return row.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var user<User>	objeto CRUD
	*/
	UsersURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var user=new User(app.container.database.Schema.User);
		user.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/users",UsersURI);
	/*
	* @api {get} /v1/auth/ Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var user<User>	objeto CRUD
	* Authorization: Basic base64(username:pass)
	*/
	app.post('/v1/auth',function(request,response,next){
		const base64=require('base-64');
		var username=request.body.username;
		var pass=base64.encode(request.body.password);
		app.container.database.Schema.User.findOne({$or:[{username:username},{email:username}]}).then(function(data){
			if(!data || pass!=data.password){
				throw new UserException("usuario invalido!");
			}
			request.user = request.remoteUser = data;
			next();
		}).catch(function(error){
			next(error);
		});
	},function(request,response,next){
		var user=new Token(app.container.database.Schema.Sessions);
		var address=request.connection.address() || request.socket.address();
		var navigator=request.headers['user-agent'];
		user.add(request.user,address.address,navigator).then(function(token){
			response.send(token);
		}).catch(function(error){
			next(error);
		});
	});

	/*
	* Ruta /v1/teachers
	* @var PeopleURI object enrutador para agrupar metodos
	*/
	var PeopleURI = express.Router();
	/*
	* @api {post} / Crear profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*/
	PeopleURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
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
		if(Validator.isNull()(request.body.genero)){
			throw new ValidatorException("Es necesario un genero");
		}
		if(request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		request.body.dni=request.body.dni.toUpperCase();
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
	* @api {get} / Obtener todos los docentes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<People>	objeto CRUD
	*/
	PeopleURI.get("/",function(request, response,next) {
		app.container.database.Schema.Teachers.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<People>	objeto CRUD
	*/
	PeopleURI.get("/:id",function(request, response,next) {
		app.container.database.Schema.Teachers.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el docente!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	PeopleURI.put("/:id",function(request, response,next) {
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthdate && !Validator.isDate()(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var people,teacher;
		app.container.database.Schema.Teachers.findOne({_id:request.params.id}).then(function(data){
			teacher=data;
			if(!data){
				throw new VoidException("No existe un registro de este tipo");
			}
			return app.container.database.Schema.Peoples.findOne({_id:teacher.data._id})
		}).then(function(data){
			people=data;
			if(!data){
				throw new VoidException("No existe un registro de este tipo");
			}
			var fields=people.toJSON();
			for (i in fields){
				if(request.body[i] && i!="dni"){
					people[i]=request.body[i];
				}
			}
			teacher.data=people;
			if(request.body.interprete){
				teacher.interprete=request.body.interprete;
			}
			return Promise.all([people.save(),teacher.save()]);
		}).then(function(data){
			response.send(data[1]);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	PeopleURI.put("/:id/grade/:grade",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.grade)){
			throw new ValidatorException("el id no es valido!");
		}
		Promise.all([app.container.database.Schema.Teachers.findOne({_id:request.params.id}),app.container.database.Schema.Grades.findOne({_id:request.params.grade})]).then(function(data){
			if(!data[0]){
				throw new ValidatorException("No existe un registro de este tipo");
			}
			if(!data[1]){
				throw new ValidatorException("No existe el grado!");
			}
			data[0].grade=data[1];
			return data[0].save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un profesor
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	PeopleURI.delete("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Teachers);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.id}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/people/teachers",PeopleURI);
	/*
	* Ruta /v1/students
	* @var StudentsURI object enrutador para agrupar metodos
	*/
	var StudentsURI = express.Router();
	/*
	* @api {post} / Crear alumno
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
		if(!Validator.isMongoId()(request.body.parent)){
			throw new ValidatorException("Es necesario el representante");
		}
		if(Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(!Validator.isDate()(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(Validator.isNull()(request.body.genero)){
			throw new ValidatorException("Es necesario un genero");
		}
		if(request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var fields={
			data:JSON.parse(JSON.stringify(request.body)),
			activities:[],
			conflicts:[],
			habilitys:[]
		};
		fields.data.mode="STUDENT";
		delete(fields.data.grade);
		delete(fields.data.parent);
		var parentData,responseData;
		app.container.database.Schema.Representatives.findOne({_id:request.body.parent}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el representante");
			}
			parentData=data;
			fields.data.dni=parentData.data.dni+"-"+Date.now();
			return people2.add(fields.data);
		}).then(function(data){
			fields.data=data;
			return people.add(fields);
		}).then(function(data){
			parentData.students.push(data._id);
			responseData=data;
			return parentData.save();
		}).then(function(data){
			response.send(responseData);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todos los alumnos
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<People>	objeto CRUD
	*/
	StudentsURI.get("/",function(request, response,next) {
		app.container.database.Schema.Students.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	*/
	StudentsURI.get("/:id",function(request, response,next) {
		app.container.database.Schema.Students.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el alumno!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	*/
	StudentsURI.get("/grade/:id",function(request, response,next) {
		app.container.database.Schema.Students.find({"grade._id":request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	StudentsURI.put("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		var grade=new Grade(app.container.database.Schema.Grades);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido");
		}
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthdate && !Validator.isDate()(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.grade && !Validator.isMongoId()(request.body.grade)){
			throw new ValidatorException("El grado es invalido");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var people, student,gradeData,p1;
		if(request.body.grade){
			p1=grade.find({_id:request.body.grade}).then(function(data){
				gradeData=data;
				return app.container.database.Schema.Students.findOne({_id:request.params.id});
			});
		}else{
			p1=app.container.database.Schema.Students.findOne({_id:request.params.id});
		}
		p1=p1.then(function(data){
			student=data;
			if(gradeData){
				student.grade=gradeData;
			}
			return app.container.database.Schema.Peoples.findOne({_id:student.data._id});
		});
		p1.then(function(data){
			people=data;
			var fields=people.toJSON();
			for (i in fields){
				if(request.body[i] && i!="dni" && i!="mode" && typeof(fields[i])!="object"){
					people[i]=request.body[i];
				}
			}
			student.data=people;
			var fields=student.toJSON();
			for (i in fields){
				if(request.body[i] && i!="dni" && typeof(fields[i])!="object"){
					student[i]=request.body[i];
				}
			}
			return Promise.all([people.save(),student.save()]);
		}).then(function(data){
			response.send(data[1]);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	StudentsURI.put("/:id/sound/test",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		var CIWeb=require("ciweb");
		var data=require("ciweb/data/audiometria.json");
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido");
		}
		if(!Validator.isJSON()(request.body.value)){
			throw new ValidatorException("es necesario un arreglo valido");
		}
		var X=CIWeb.Matrix.Reshape(JSON.parse(request.body.value),1,5);
		var H=CIWeb.Tbrain.LinealRegression.Propagation(X,data);
		app.container.database.Schema.Students.findOne({_id:request.params.id}).then(function(data){
			data.discapacityLevel=140-H;
			return data.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	StudentsURI.delete("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.id}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} / añadir desarrollo fisico
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*/
	StudentsURI.post("/:id/physic",function(request, response,next) {
		if(!Validator.isFloat()(request.body.weight) || !Validator.isFloat()(request.body.height)){
			throw new ValidatorException("El peso y estatura son medidas en centimetros!");
		}
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.Students.findOne({_id:request.params.id}).then(function(data){
			var now=Date.now();
			var last=new Date(`${data.data.birthdate}T00:00:00`);
			var age=Math.round((now-last.getTime())/31536000000);
			var element=app.container.database.Schema.physic({
				weight:request.body.weight,
				height:request.body.height,
				age:age
			});
			data.physics.push(element);
			Events.emit("physic-add",element,data);
			return data.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	StudentsURI.put("/:id/activity/:activity",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var people2=new People(app.container.database.Schema.Peoples);
		var CIWeb=require("ciweb");
		var data=require("ciweb/data/audiometria.json");
		if(!Validator.isMongoId()(request.params.id)|| !Validator.isMongoId()(request.params.activity)){
			throw new ValidatorException("El id es invalido");
		}
		Promise.all([app.container.database.Schema.Students.findOne({_id:request.params.id}),app.container.database.Schema.Activities.findOne({_id:request.params.activity})]).then(function(data){
			if(!data[0]){
				throw new ValidatorException("No existe el alumno!");
			}
			if(!data[1]){
				throw new ValidatorException("No existe la actividad!");
			}
			data[1].students.push(data[0]._id);
			return data[1].save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});

	StudentsURI.delete("/:id/physic/:del",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id) || !Validator.isMongoId()(request.params.del)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.Students.findOne({_id:request.params.id}).then(function(data){
			for (i in data.physics){
				if(data.physics[i]._id==request.params.del){
					data.physics[i].remove();
					break;
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
	* @api {post} /:dni/test/:test Crear test alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*\/
	StudentsURI.post("/:dni/test/:test",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Students);
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		if(!Validator.matches(/^[VE][0-9]{6,15}/i)(request.params.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		var input=JSON.parse(request.body.test);
		if(!Validator.isInt()(input.time,{min:5000})){
			throw new ValidatorException("El tiempo de prueba registrado no cumple las expectativas!");
		}
		test.find({name:request.params.test.toUpperCase()}).then(function(inteligence){
			return people.update({"data.dni":request.params.dni},function(data){
				var time=new Date(data.data.birthdate);
				var age=Math.floor((Date.now()-time.getTime())/(86400000*364));
				var value=0,percentil=0;
				inteligence.serie.forEach(function(serie){
					if(input.serie[serie.name] && !(serie.age.min>=age && serie.age.max<=age)){
						throw new ValidatorException("No tiene la edad suficiente para realizar una serie de este tipo");
					}
					for (i in input.serie[serie.name]){
						if(serie.items[i]){
							value+=input.serie[serie.name][i]==serie.items[i].value;
						}
					}
				});
				var test=new app.container.database.Schema.testIntStudent({
					name:inteligence.name,
					value:value,
					percentil:0,
					time:input.time,
					serie:input.serie
				});
				// Es necesario validar campos y valores
				data.test.push(test);
				return data;
			})
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	}); */
	app.use("/v1/people/students",StudentsURI);
	/*
	* Ruta /v1/representives
	* @var ReferencesToURI object enrutador para agrupar metodos
	*/
	var ReferencesToURI = express.Router();
	/*
	* @api {post} / Crear representante
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
		if(!Validator.isDate()(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		if(Validator.isNull()(request.body.genero)){
			throw new ValidatorException("Es necesario un genero");
		}
		if(request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var fields={
			data:JSON.parse(JSON.stringify(request.body)),
		};
		fields.data.mode="PARENT";
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
	* @api {get} / Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	*/
	ReferencesToURI.get("/",function(request, response,next) {
		app.container.database.Schema.Representatives.find().populate('students').then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	*/
	ReferencesToURI.get("/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.Representatives.findOne({_id:request.params.id}).populate('students').then(function(data){
			if(!data){
				throw new ValidatorException("No existe el representante!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	* @var grade<Grade>	objeto CRUD
	*/
	ReferencesToURI.put("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		var people2=new People(app.container.database.Schema.Peoples);
		var grade=new Grade(app.container.database.Schema.Grades);
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthdate && !Validator.isDate()(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var people, represent;
		app.container.database.Schema.Representatives.findOne({_id:request.params.id}).then(function(data){
			represent=data;
			return app.container.database.Schema.Peoples.findOne({_id:represent.data._id});
		}).then(function(data){
			people=data;
			var fields=people.toJSON();
			for (i in fields){
				if(request.body[i] && i!="dni"){
					people[i]=request.body[i];
				}
			}
			represent.data=people;
			var fields=represent.toJSON();
			for (i in fields){
				if(request.body[i] && i!="dni"){
					represent[i]=request.body[i];
				}
			}
			return Promise.all([people.save(),represent.save()]);
		}).then(function(data){
			response.send(data[1]);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	ReferencesToURI.delete("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.id}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/people/parents",ReferencesToURI);/*


	/*
	* Ruta /v1/learning
	* @var learningURI object enrutador para agrupar metodos
	*/
	var inferenURI = express.Router();
	/*
	* Ruta /v1/learning/domain

	* @api {post} / Crear dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	inferenURI.post("/type",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.events);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		if(!Validator.isJSON()(request.body.objects)){
			throw new ValidatorException("Es necesario un arreglo valido");
		}
		request.body.objects=JSON.parse(request.body.objects);
		category.add(request.body.name.toUpperCase(),request.body).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas los dominios del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.get("/type",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.events);
		app.container.database.Schema.events.find().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener un dominio del aprendizaje
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.get("/type/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.events.findOne({_id:request.params.id}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el evento!");
			}
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.put("/type/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.events);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		if(request.body.name && Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		if(request.body.objects && !Validator.isJSON()(request.body.objects)){
			throw new ValidatorException("Es necesario un arreglo valido");
		}
		category.update({_id:request.params.id},function(row){
			for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
				if(request.body[keys[i]]){
					row[keys[i]]=request.body[keys[i]];
				}
			}
			return row;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.delete("/type/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.events);
		category.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});


	/*
	* @api {post} / Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	inferenURI.post("/:event/inferences",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var domain=new CategoryCoginitions(app.container.database.Schema.events);
		if(Validator.isNull()(request.body.premise)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		if(Validator.isNull()(request.body.consecuent)){
			throw new ValidatorException("Es necesario una consecuencia");
		}
		if(Validator.isNull()(request.params.event)){
			throw new ValidatorException("Solo se aceptan dominios validos");
		}
		domain.find({name:request.params.event.toUpperCase()}).then(function(row){
			row.premises.push(app.container.database.Schema.inferences({
				premise:request.body.premise,
				consecuent:request.body.consecuent
			}));
			return row.save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.get("/:event/inferences",function(request, response,next) {
		if(Validator.isNull()(request.params.event)){
			throw new ValidatorException("Solo se aceptan dominios validos");
		}
		app.container.database.Schema.events.findOne({name:request.params.event.toUpperCase()}).then(function(row){
			if(!row){
				throw new ValidatorException("No existe el evento!");
			}
			response.send(row.premises);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.get("/:event/inferences/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id no es valido!");
		}
		app.container.database.Schema.events.findOne({name:request.params.event.toUpperCase()}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el evento!");
			}
			for (var i=0,n=data.premises.length;i<n;i++){
				if(data.premises[i]._id==request.params.id){
					response.send(data.premises[i]);
					return;
				}
			}
			throw new ValidatorException("No existe la inferencia!");
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.put("/:event/inferences/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.events);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		category.update({name:request.params.event.toUpperCase()},function(obj){
			var findElement=false;
			obj.premises=obj.premises.map(function(row){
				if(request.params.id==row._id){
					findElement=true;
					for(var i=0,keys=Object.keys(row.schema.obj),n=keys.length;i<n;i++){
						if(request.body[keys[i]]){
							row[keys[i]]=request.body[keys[i]];
						}
					}
				}
				return row;
			});
			if(!findElement){
				throw VoidException("No existe el registro!");
			}
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	inferenURI.delete("/:event/inferences/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.events);
		category.update({name:request.params.event.toUpperCase()},function(obj){
			for(i in obj.premises){
				if(obj.premises[i]._id==request.params.id){
					obj.premises[i].remove();
					break;
				}
			}
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});


	app.use("/v1/events",inferenURI);


	var activityURI = express.Router();
	/*
	* @api {post} /:domain/activities/:type Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	activityURI.post("/:grade/:course",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var dm;
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Es requerido un nombre");
		}
		if(Validator.isNull()(request.body.description)){
			throw new ValidatorException("Es necesaria una description");
		}
		if(!Validator.isDate()(request.body.expire)){
			throw new ValidatorException("Es necesaria una fecha de expiracion");
		}
		var dni=request.user.people.dni;
		if(request.body.teacher && request.user.isAdmin==true){
			dni=request.body.teacher;
		}
		Promise.all([app.container.database.Schema.Grades.findOne({name:request.params.grade.toUpperCase()}),app.container.database.Schema.Courses.findOne({name:request.params.course.toUpperCase()}),app.container.database.Schema.Teachers.findOne({"data.dni":dni.toUpperCase()}),Events.get("ACTIVITY-ADD")]).then((data)=>{
			if(!data[0]){
				throw new ValidatorException("No existe el grado!");
			}
			if(!data[1]){
				throw new ValidatorException("No existe la materia!");
			}
			if(!data[2]){
				throw new ValidatorException("No existe el docente!");
			}
			var activity=new app.container.database.Schema.Activities({
				name:request.body.name,
				description:request.body.description,
				objetives:[],
				isCompleted:false,
			   	dateExpire:new Date(request.body.expire.replace(" ","T")),
			   	teacher: data[2]._id,
				student: [],
				grade:data[0],
				course:data[1]
			});
			if(data[3]){
				var result=Inference.apareamiento(data.premises,{
					p1:request.body.name,
					p2:request.body.description,
					p3:activity.dateExpire.getTime(),
					p4:Date.now(),
				});
				if(result.q1 && /Error\:/ig.test(result.q1)){
					throw new ValidatorException(result.q1);
				}
			}
			return activity.save();
			return "Hola";
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /:domain/activities/:type Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	activityURI.put("/:grade/:course/:id/:domain/objetives/:level/:objetive",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var dm;
		if(!Validator.isMongoId()(request.params.objetive)){
			throw new ValidatorException("El objetivo no es un id valido!");
		}
		Promise.all([app.container.database.Schema.LearningObjetive.findOne({_id:request.params.objetive}),app.container.database.Schema.Activities.findOne({"grade.name":request.params.grade.toUpperCase(),"course.name":request.params.course.toUpperCase(),_id:request.params.id}).populate("students")]).then((data)=>{
			if(!data[0]){
				throw new ValidatorException("No existe el objetivo de aprendizaje!");
			}
			if(!data[1]){
				throw new ValidatorException("No existe la actividad!");
			}
			data[1].objetives.push(data[0]);
			return data[1].save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	activityURI.get("/:grade/:teacher/:course",function(request, response,next) {
		app.container.database.Schema.Activities.find({"grade.name":request.params.grade.toUpperCase(),"course.name":request.params.course.toUpperCase(),teacher:request.params.teacher}).then(function(rows){
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	activityURI.get("/:grade/:teacher",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.teacher)){
			throw new ValidatorException("el docente es invalido");
		}
		app.container.database.Schema.Activities.find({"grade.name":request.params.grade.toUpperCase(),teacher:request.params.teacher}).then(function(rows){
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	activityURI.get("/:id",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.Activities.findOne({_id:request.params.id}).then(function(rows){
			if(!rows){
				throw new ValidatorException("No existe la actividad!");
			}
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});

	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	activityURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		app.container.database.Schema.Activities.findOne({_id:request.params.id }).then(function(obj){
			if(!obj){
				throw new ValidatorException("No existe el registro");
			}
			return obj.remove();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/activities",activityURI);


/*

	/*
	* Ruta /v1/words/morphema
	* @var ReferencesToURI object enrutador para agrupar metodos
	*\/
	var morphema = express.Router();
	/*
	* @api {post} / Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people3<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*\/
	morphema.post("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		var people3=new SubPeople(app.container.database.Schema.Students);
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
	* @api {post} /type Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people3<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*\/
	morphema.post("/type",function(request, response,next) {
		var morphem=new CRUD(app.container.database.Schema.morphem_type);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("El nombre solo debe contener letras");
		}
		var input={
			name:request.body.name.toString()
		};
		morphem.add(input,input).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /type Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people3<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*\/
	morphema.get("/type",function(request, response,next) {
		var morphem=new CRUD(app.container.database.Schema.morphem_type);
		morphem.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /type Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people3<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*\/
	morphema.get("/type/:id",function(request, response,next) {
		var morphem=new CRUD(app.container.database.Schema.morphem_type);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		morphem.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /type Crear representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople> objeto CRUD
	* @var people3<SubPeople> objeto CRUD
	* @var people2<People> objeto CRUD
	*\/
	morphema.delete("/type/:id",function(request, response,next) {
		var morphem=new CRUD(app.container.database.Schema.morphem_type);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		morphem.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	*\/
	morphema.get("/",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		people.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	*\/
	morphema.get("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		people.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	* @var grade<Grade>	objeto CRUD
	*\/
	morphema.put("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		var people2=new People(app.container.database.Schema.Peoples);
		var grade=new Grade(app.container.database.Schema.Grades);
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthdate && !Validator.isDate()(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}

		var people, represent;
		app.container.database.Schema.Representatives.findOne({_id:request.params.id}).then(function(data){
			represent=data;
			return app.container.database.Schema.Peoples.findOne({_id:represent.data._id});
		}).then(function(data){
			people=data;
			var fields=people.toJSON();
			for (i in fields){
				if(request.body[i] && i!="dni"){
					people[i]=request.body[i];
				}
			}
			represent.data=people;
			var fields=represent.toJSON();
			for (i in fields){
				if(request.body[i] && i!="dni"){
					represent[i]=request.body[i];
				}
			}
			return Promise.all([people.save(),represent.save()]);
		}).then(function(data){
			response.send(data[1]);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*\/
	morphema.delete("/:id",function(request, response,next) {
		var people=new SubPeople(app.container.database.Schema.Representatives);
		var people2=new People(app.container.database.Schema.Peoples);
		people.remove({_id:request.params.id}).then(function(data){
			response.send(data);
			return people2.remove(data.data._id);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/words/morphema",morphema);
*/









/*






	/*
	* Ruta /v1/habilities
	* @var HabilitiesURI object enrutador para agrupar metodos
	*\/
	var HabilitiesURI = express.Router();
	/*
	* @api {post} / Crear habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var hability<Habilities>	objeto CRUD
	*\/
	HabilitiesURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
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
	* @api {get} / Obtener todas las habilidades
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var hability<Habilities>	objeto CRUD
	*\/
	HabilitiesURI.get("/",function(request, response,next) {
		var hability=new Habilities(app.container.database.Schema.Habilities);
		hability.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener una habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var hability<Habilities>	objeto CRUD
	*\/
	HabilitiesURI.get("/:id",function(request, response,next) {
		var hability=new Habilities(app.container.database.Schema.Habilities);
		hability.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var hability<Habilities>	objeto CRUD
	*\/
	HabilitiesURI.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var hability=new Habilities(app.container.database.Schema.Habilities);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		hability.update({_id:request.params.id},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una habilidad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var hability<Habilities>	objeto CRUD
	*\/
	HabilitiesURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var grade=new Habilities(app.container.database.Schema.Habilities);
		grade.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/habilities",HabilitiesURI);
	/*
	* Ruta /v1/activities
	* @var ActivitiesURI object enrutador para agrupar metodos
	*\/
	var ActivitiesURI = express.Router();
	/*
	* @api {post} / Crear Actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var grade<Activities>	objeto CRUD
	* @var people<SubPeople>	objeto CRUD
	* @var course<Course>	objeto CRUD
	*\/
	ActivitiesURI.post("/",function(request, response,next) {
		var grade= new Activities(app.container.database.Schema.Activities);
		var people= new SubPeople(app.container.database.Schema.Teachers);
		var course= new Course(app.container.database.Schema.Courses);
		var min=parseInt(request.body.minDate);
		var max=parseInt(request.body.maxDate);
		if(Validator.isNull()(request.body.name) || Validator.isNull()(request.body.description)){
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
		if(!request.people){
			throw new ValidatorException("Un usuario root por defecto no puede insertar actividades!");
		}
		//var a=;
		var field={
			name:request.body.name,
			TeacherCreate:new app.container.database.Schema.Teachers(request.people),
			description:request.body.description,
			course:null,
			range:{
				level:0,
				min:min,
				max:max
			},
			conflicts:[],
			habilitys:[]
		};
		course.find({_id:request.body.course}).then(function(course){
			field.course=course;
			return grade.add(field);
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todas las actividades
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var activity<Activities>	objeto CRUD
	*\/
	ActivitiesURI.get("/",function(request, response,next) {
		var activity=new Activities(app.container.database.Schema.Activities);
		activity.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener una actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var activity<Activities>	objeto CRUD
	*\/
	ActivitiesURI.get("/:id",function(request, response,next) {
		var activity= new Activities(app.container.database.Schema.Activities);
		activity.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var activity<Activities>	objeto CRUD
	* @var people<SubPeople>	objeto CRUD
	* @var course<Course>	objeto CRUD
	*\/
	ActivitiesURI.put("/:id",function(request, response,next) {
		var activity= new Activities(app.container.database.Schema.Activities);
		var people= new SubPeople(app.container.database.Schema.Teachers);
		var course= new Course(app.container.database.Schema.Courses);

		if(request.body.name){
			throw new ValidatorException("No puede modificar el campo nombre");
		}
		if(request.body.max){
			var max=parseInt(request.body.max);
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
				return activity.update({_id:request.params.id},function(obj){
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
			promise1=activity.update({_id:request.params.id},function(obj){
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
	* @api {delete} /:id Eliminar una actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var activity<Activities>	objeto CRUD
	*\/
	ActivitiesURI.delete("/:id",function(request, response,next) {
		var activity=new Activities(app.container.database.Schema.Activities);
		activity.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/activities",ActivitiesURI);
	/*
	* Ruta /v1/conflicts
	* @var ConflictCognitionsURI object enrutador para agrupar metodos
	*\/
	var ConflictCognitionsURI = express.Router();
	/*
	* @api {post} / Crear Conflicto Cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var conflict<Habilities>	objeto CRUD
	*\/
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
	* @api {get} / Obtener todas los conflictos cognitivos
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var conflict<Habilities>	objeto CRUD
	*\/
	ConflictCognitionsURI.get("/",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);
		conflict.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un conflicto cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var conflict<Habilities>	objeto CRUD
	*\/
	ConflictCognitionsURI.get("/:id",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);
		conflict.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar conflicto cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var conflict<Habilities>	objeto CRUD
	*\/
	ConflictCognitionsURI.put("/:id",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("No se acepta campos nulos");
		}
		conflict.update({_id:request.params.id},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un conflicto cognitivo
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var activity<Activities>	objeto CRUD
	*\/
	ConflictCognitionsURI.delete("/:id",function(request, response,next) {
		var conflict=new Habilities(app.container.database.Schema.ConflictCognitions);
		conflict.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/conflicts",ConflictCognitionsURI);
	/*
	* Ruta /v1/periods
	* @var periodURI object enrutador para agrupar metodos
	*\/
	var periodURI = express.Router();
	/*
	* @api {post} / Crear periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var period<Period>	objeto CRUD
	*\/
	periodURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
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
	* @api {get} / Obtener todos los periodos escolares
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var period<Period>	objeto CRUD
	*\/
	periodURI.get("/",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		period.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var period<Period>	objeto CRUD
	*\/
	periodURI.get("/:id",function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		period.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var period<Period>	objeto CRUD
	*\/
	periodURI.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		if(!Validator.matches(/[0-9]{4}\-[0-9]{4}/i)(request.body.name)){
			throw new ValidatorException("Solo se acepta formato de periodo escolar");
		}
		period.update({_id:request.params.id},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un periodo escolar
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var period<Period>	objeto CRUD
	*\/
	periodURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var period=new Period(app.container.database.Schema.PeriodSchools);
		period.remove({_id:request.params.id}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/periods",periodURI);
	/*
	* Ruta /v1/cognitions
	* @var categoryCognitionURI object enrutador para agrupar metodos
	*\/
	var categoryCognitionURI = express.Router();
	/*
	* @api {post} / Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*\/
	categoryCognitionURI.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
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
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*\/
	categoryCognitionURI.get("/",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		category.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:name Obtener una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*\/
	categoryCognitionURI.get("/:name",function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		category.find({name:request.params.name.toUpperCase()}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*\/
	categoryCognitionURI.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		category.update({_id:request.params.id.toUpperCase()},function(obj){
			obj.name=request.body.name;
			return obj;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*\/
	categoryCognitionURI.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		category.remove({_id:request.params.id}).then(function(data){
			response.send({data});
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} / Crear funcion cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	* @var cognition<Cognitions> objeto CRUD
	*\/
	categoryCognitionURI.post("/:name",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan caracteres alphabeticos");
		}
		if(Validator.isNull()(request.params.name)){
			throw new ValidatorException("Solo se aceptan categorias validas");
		}
		category.update({name:request.params.name.toUpperCase()},function(cat){
			name=request.body.name.toUpperCase().trim();
			cat.cognitions.filter(function(row){
				if(name==row.name){
					throw new ValidatorException("Ya existe un registro identico!");
				}
			});
			cat.cognitions.push({
				name:name,
			});
			return cat;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar funcion cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var cognition<Cognitions>	objeto CRUD
	* @var category<CategoryCoginitions>	objeto CRUD
	*\/
	categoryCognitionURI.put("/:name/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan caracteres alphabeticos");
		}
		if(Validator.isNull()(request.params.name)){
			throw new ValidatorException("Solo se aceptan categorias validas");
		}
		category.update({name:request.params.name.toUpperCase()},function(cat){
			cat.cognitions=cat.cognitions.map(function(row){
				if(row._id==request.params.id){
					row.name=request.body.name.toUpperCase();
				}
				return row;
			});
			return cat;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una funcion cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var cognition<Cognitions>	objeto CRUD
	*\/
	categoryCognitionURI.delete("/:name/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var category=new CategoryCoginitions(app.container.database.Schema.CategoryCognitions);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Solo se aceptan caracteres alphabeticos");
		}
		if(Validator.isNull()(request.params.name)){
			throw new ValidatorException("Solo se aceptan categorias validas");
		}
		category.update({name:request.params.name.toUpperCase()},function(cat){
			for (i in cat.cognitions){
				if(cat.cognitions[i]._id==request.params.id){
					cat.cognitions[i].remove();
					return cat;
				}
			}
			throw new ValidatorException("No existe un registro de este tipo");
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/cognitions",categoryCognitionURI);



	/*
	* Ruta /v1/test
	* @var testParent object enrutador para agrupar metodos
	*\/
	var testParent = express.Router();
	/*
	* @api {post} / Crear un test
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD> objeto CRUD
	*\/
	testParent.post("/",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Es requerido un nombre");
		}
		if(request.body.range && !Validator.isJSON(request.body.range)){
			throw new ValidatorException("Los datos de rangos no son validos");
		}
		var fields={
			name:request.body.name.toString(),
			range:(request.body.range) ? new app.container.database.Schema.RangeInteligence(JSON.parse(request.body.range)) : null
		};
		test.add({name:fields.name},fields).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todos los test
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	testParent.get("/",Auth.isTeacherOrNot.bind(app.container),function(request, response,next) {
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		test.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	testParent.get("/:id",Auth.isTeacherOrNot.bind(app.container),function(request, response,next) {
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		test.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {put} /:id Editar representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	testParent.put("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		if(!Validator.isJSON(request.body.range)){
			throw new ValidatorException("Los datos de rangos no son validos");
		}
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		test.update({_id:request.params.id},function(data){
			data.range= new app.container.database.Schema.RangeInteligence(JSON.parse(request.body.range));
			return data;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un test
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	testParent.delete("/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		test.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /:name Crear una serie de un test
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD> objeto CRUD
	*\/
	testParent.post("/:name",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var min=parseInt(request.body.minDate);
		var max=parseInt(request.body.maxDate);
		var count=parseInt(request.body.count);
		if(!Validator.isInt()(request.body.minDate) || min<3 || min>=150){
			throw new ValidatorException("La edad minima no es aceptada");
		}
		if(!Validator.isInt()(request.body.maxDate) || max>150 || max <=3){
			throw new ValidatorException("La edad máxima no es aceptada");
		}
		if((max-min)<=0 || count<=0){
			throw new ValidatorException("El rango entre las edades debe ser mayor a cero");
		}
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		test.update({name:request.params.name.toUpperCase()},function(data){
			var serie=new app.container.database.Schema.SerieInteligence({
				name:request.body.name,
				age:{
					min:min,
					max:max
				},
				length:count
			});
			data.serie.filter(function(row){
				if(row.name==serie.name){
					throw new ValidatorException("Ya existe un item con elementos similares");
				}
			})
			data.serie.push(serie);
			return data;
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una serie
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	testParent.delete("/:name/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		test.update({name:request.params.name.toUpperCase()},function(data){
			for (i in data.serie){
				if(data.serie[i]._id==request.params.id){
					data.serie[i].remove();
					return data;
				}
			}
			throw new ValidatorException("No existe un registro de este tipo");
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /:name/:id añadir un item a una serie de un test
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD> objeto CRUD
	*\/
	testParent.post("/:name/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		if(Validator.isNull()(request.params.name)){
			throw new ValidatorException("Es requerido un nombre");
		}
		if(!Validator.isNumeric()(request.body.correct)){
			throw new ValidatorException("Es necesario un numero para la respuesta correcta al item");
		}
		test.update({name:request.params.name.toUpperCase()},function(data){
			for (i in data.serie){
				if(data.serie[i]._id==request.params.id){
					if(!(request.body.correct>=0 && request.body.correct<data.serie[i].length)){
						throw new ValidatorException("El valor correcto del item esta fuera del rango aceptado por la serie");
					}
					var item=new app.container.database.Schema.ItemsInteligence({
						name:request.body.name,
						value:request.body.correct
					});
					data.serie[i].items.push(item);
					return data;
				}
			}
			throw new ValidatorException("No existe un registro de este tipo");
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar una serie
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	testParent.delete("/:name/:id/:item",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var test=new CRUD(app.container.database.Schema.TestInteligence);
		test.update({name:request.params.name.toUpperCase()},function(data){
			for (i in data.serie){
				if(data.serie[i]._id==request.params.id){
					for(j in data.serie[i].items){
						if(data.serie[i].items[j]._id==request.params.item){
							data.serie[i].items[j].remove();
							return data;
						}
					}
				}
			}
			throw new ValidatorException("No existe un registro de este tipo");
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /range añadir un rango de inteligencia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD> objeto CRUD
	*\/
	testParent.post("/inteligence/range",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var user=new CRUD(app.container.database.Schema.groupsInteligence);
		var min=parseInt(request.body.min);
		var max=parseInt(request.body.max);
		var count=parseInt(request.body.count);
		if(!Validator.isInt()(request.body.min) || min<=0){
			throw new ValidatorException("el rango minimo no es aceptada");
		}
		if(!Validator.isInt()(request.body.max) || max>150){
			throw new ValidatorException("el rango máximo no es aceptada");
		}
		if((max-min)<=0 || count<=0){
			throw new ValidatorException("El rango entre las edades debe ser mayor a cero");
		}
		if(Validator.isNull()(request.params.name)){
			throw new ValidatorException("Es requerido un nombre");
		}
		if(Validator.isNull()(request.params.simbol)){
			throw new ValidatorException("Es requerido un simbolo del rango");
		}
		var fields={
			name:request.body.name.toString(),
			range:{
				min:min,
				max:max
			},
			simbol:request.params.simbol
		};
		user.add({name:fields.name},fields).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/test",testParent);
	/*
	* Ruta /v1/inteligence
	* @var inteligenceURI object enrutador para agrupar metodos
	*\/
	var inteligenceURI = express.Router();
	/*
	* @api {post} /range añadir un rango de inteligencia
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD> objeto CRUD
	*\/
	inteligenceURI.post("/range",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var user=new CRUD(app.container.database.Schema.groupsInteligence);
		var min=parseInt(request.body.min);
		var max=parseInt(request.body.max);
		var count=parseInt(request.body.count);
		if(!Validator.isInt()(request.body.min) || min<=0){
			throw new ValidatorException("el rango minimo no es aceptada");
		}
		if(!Validator.isInt()(request.body.max) || max>150){
			throw new ValidatorException("el rango máximo no es aceptada");
		}
		if((max-min)<=0 || count<=0){
			throw new ValidatorException("El rango entre las edades debe ser mayor a cero");
		}
		if(Validator.isNull()(request.body.simbol)){
			throw new ValidatorException("Es requerido un simbolo del rango");
		}
		var fields={
			name:request.body.name.toString(),
			range:{
				min:min,
				max:max
			},
			simbol:request.body.simbol.toString()
		};
		user.add({name:fields.name},fields).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} / Obtener todos los test
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	inteligenceURI.get("/range",Auth.isTeacherOrNot.bind(app.container),function(request, response,next) {
		var user=new CRUD(app.container.database.Schema.groupsInteligence);
		user.get().then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {get} /:id Obtener un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var test<CRUD>	objeto CRUD
	*\/
	inteligenceURI.get("/range/:id",Auth.isTeacherOrNot.bind(app.container),function(request, response,next) {
		var user=new CRUD(app.container.database.Schema.groupsInteligence);
		user.find({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {delete} /:id Eliminar un representante
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var user<User>	objeto CRUD
	*\/
	inteligenceURI.delete("/range/:id",Auth.isAdmin.bind(app.container),function(request, response,next) {
		var user=new CRUD(app.container.database.Schema.groupsInteligence);
		user.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/inteligence",inteligenceURI);*/
}
