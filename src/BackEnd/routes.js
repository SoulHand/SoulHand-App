var Grade = require('./SoulHand/Grade.js')
// var Period = require('./SoulHand/Period.js')
var People = require('./SoulHand/People.js')
var SubPeople = require('./SoulHand/SubPeople.js')
var CategoryCoginitions = require('./SoulHand/CategoryCoginitions.js')
var User = require('./SoulHand/User.js')
var Token = require('./SoulHand/Token.js')
var Validator = require('string-validator')
var ValidatorException = require('./SoulHand/Exceptions/ValidatorException.js')
var VoidException = require('./SoulHand/Exceptions/VoidException.js')
var UserException = require('./SoulHand/Exceptions/UserException.js')
var KeywordVoidException = require('./SoulHand/Exceptions/KeywordVoidException.js')
var MachineError = require('./SoulHand/Exceptions/MachineError.js')
// var basicAuth = require('basic-auth-connect')
// const logger = require('winston')
var Auth = require('./SoulHand/Auth.js')
var corpusRoutes = require('./Corpus/routes.js');
var mongoose = require("mongoose");
var WORDS = require("./words.js");
const ObjectId = mongoose.Types.ObjectId;



module.exports = function (app, express, Schema, __DIR__) {
	let Events = require('./SoulHand/inferencia/events.js')(Schema)
	corpusRoutes(app, express, Schema, Events, __DIR__);
	
	/*
  * Ruta /v1/reports
  * @var gradeURI object enrutador para agrupar metodos
  */
  let reportsURI = express.Router()
  /*
  * @api {get} /dashboard Obtener indicadores
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  reportsURI.get('/dashboard', function (request, response, next) {
    Schema.Teachers.findOne({'data.dni': request.user.people.dni})
    .then((row) => {
      if (!row) {
        throw new ValidatorException('No existe el docente!')
			}
			var query = [];
			if (row.grade) {
				query = Schema.Students.find({
					"grade._id": ObjectId(row.grade._id)
				})
			}
      return Promise.all([
				Schema.Activities.find({
					$and: [
						{teacher: row._id},
						{
							dateCreated: {
								$gt: Date.now() - 6912e+5
							}
						},
						{
							dateCreated: {
								$lt: Date.now()
							}
						}
					]
				})
				.populate("objetives"),
				Schema.Activities.find({
					$and: [
						{teacher: row._id},
						{
							dateCreated: {
								$gt: Date.now() - 6912e+5
							}
						},
						{
							dateCreated: {
								$lt: Date.now()
							}
						},
						{
							isCompleted: false
						}
					]
				})
				.populate("objetives"),
				Schema.Activities.find({
					$and: [
						{teacher: row._id},
						{
							dateCreated: {
								$gt: Date.now() - 6912e+5
							}
						},
						{
							dateCreated: {
								$lt: Date.now()
							}
						},
						{
							isCompleted: true
						}
					]
				})
				.populate("objetives"),
				query
				/*,
				Schema.Activities.aggregate([
					{
						$group: {
							_id: "$course.name",
							activities: { $push: "$$ROOT"},
							count: {$sum: 1}
						}
					}
				])*/
			]);
    }).then(function(rows){
			let activitiesAll = rows[0],
					activitiesPending = rows[1],
					activitiesCompleted = rows[2],
					students = rows[3];
			let count = {
				activities: {
					completed: activitiesCompleted.length,
					pending: activitiesPending.length,
					count: activitiesAll.length,
					progress: 0,
					courses: [],
					domains: [],
					completeds: []
				},
				objetives: {
					completed: 0,
					failed: 0,
					pending: 0,
					count: 0,
					progress: 0,
					categories: [],
					domains: []
				},
				students:{
					fails: {
						data: [],
						count: 0
					}
				}
			};
			let objetives = [], min, max = 0;
			if (students) {
				count.students.fails.data = students;
				count.students.fails.count = students.length;
			}
			activitiesAll.forEach((row) => {
				row.objetives.forEach((objetive) => {
					objetives.push(objetive);
				});
			});
			if (count.activities.count > 0){
				count.activities.progress = (count.activities.completed / count.activities.count) * 100;
			}
			activitiesAll.forEach((row) => {
				var isAdd = count.activities.courses.filter((str) => {
					return row.course.name == str;
				});
				if (isAdd.length == 0) {
					var node = {
						name: row.course.name,
						data: [0, 0, 0, 0, 0]
					};
					count.activities.courses.push(row.course.name);
					count.activities.domains.push(node);
					count.activities.completeds.push(node);
				}
			});
			count.objetives.count = objetives.length;
			count.activities.domains = count.activities.domains.map((row, index) => {
				activitiesAll.forEach((activity) => {
					var date = new Date(activity.dateCreated);
					var dayWeek = date.getDay() - 1;
					if (activity.course.name == row.name && dayWeek >= 0 && dayWeek <= 4) {
						row.data[dayWeek]++;
						if (activity.isCompleted) {
							count.activities.completeds[index].data[dayWeek]++;
						}
					}
				});
				return row;
			});
			objetives.forEach((row) => {
				var isAdd = count.objetives.categories.filter((str) => {
					return row.domain.name == str;
				});
				if (isAdd.length == 0) {
					count.objetives.categories.push(row.domain.name);
					count.objetives.domains.push({
						name: row.domain.name,
						y: 0
					});
				}
			});
			count.objetives.domains = count.objetives.domains.map((row) => {
				var counter = objetives.filter((objetive) => {
					return objetive.domain.name == row.name;
				});
				row.y = counter.length;
				if(!min){
					min = row.y;
				}
				min = Math.min(min, row.y);
				max = Math.max(max, row.y);
				return row;
			});
			students.forEach((student) => {
				count.objetives.completed = student.objetives.length;
			});
			if(max > 0){
				count.objetives.progress = (1 - (min / max)) * 100;
			}
			response.send(count);
		}).catch(function(error){
			console.log(error);
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
	reportsURI.get("/students/objetive/:id", function (request, response, next) {
		Schema.Students.aggregate([
			{
				$match: { "_id": ObjectId(request.params.id) }
			},
			{ $unwind: "$objetives" },
			{ $unwind: "$objetives.objetive.cognitions" },
			{
				$group: {
					_id: { _id: "$_id", "$activities._id": "$activities._id", "$objetives._id": "$objetives._id"},
					max: { $max: "$objetives.completed" },
					min: { $min: "$objetives.completed" },
					avg: { $avg: "$objetives.completed" },
					data: { $push: "$objetives" },
					cognitions: { $addToSet: "$objetives.objetive.cognitions" },
				}
			},
			{
				$project: {
					_id: 0,
					max: 1,
					min: 1,
					avg: 1,
					cognitions: 1,
					objetives: {
						$map: {
							input: "$data",
							as: "row",
							in: {
								_id: "$$row._id",
								objetive: "$$row.objetive",
								activity: "$$row.activity",
								completed: "$$row.completed",
								avg: {
									$multiply: [{ $divide: ["$$row.exp", "$max"] }, 100]
								},
								exp: "$$row.exp"
							}
						}
					}					
				}
			}
			
		])
		.then((data) => {
			var _data = data[0];
			if (!data[0]) {
				_data = {
					_id: 0,
					max: 0,
					min: 0,
					avg: 0,
					exp: 0,
					physic: null,
					cognitions: null,
					objetives: [],
					activities: []
				};
			}
			return Promise.all([_data, Schema.Students.findOne({ _id: ObjectId(request.params.id) }).populate('activities.activity').populate('activities.objetive')]);
			//return Schema.Students.populate(data[0], { path: 'Activities' });
		}).then((data) => {
			if (!data[1]) {
				throw new ValidatorException("No existe el alumno!");
			}
			if (data[1].activities) {
				data[0].activities = data[1].activities;
			}
			data[0].exp = 0;
			for (var i = 0, n = data[0].objetives.length; i < n; i++) {
				data[0].exp += data[0].objetives[i].exp || 0;
			}
			data[0].physic = null, _now = null;
			for (var i = 0, n = data[1].physics.length; i < n; i++) {
				var _date = new Date(data[1].physics[i].date);
				if (!_now || _now < _date){
					_now = _date;
					data[0].physic = data[1].physics[i];
				}
			}
			return data[0];
		})
			.then(function (data) {
					response.send(data);
			}).catch(function (error) {
				next(error);
			});
	});

  app.use('/v1/reports', reportsURI);

  /*
  * Ruta /v1/grades
  * @var gradeURI object enrutador para agrupar metodos
  */
  let gradeURI = express.Router()
  /*
  * @api {post} / Crear grado
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */

  gradeURI.post('/', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (Validator.isNull()(request.body.name)) {
        throw new ValidatorException('El nombre solo debe contener letras')
      }
      Schema.Grades
        .findOne({name: request.body.name.toUpperCase()})
        .then((data) => {
          if (data) {
            throw new ValidatorException('El nombre del grado ya existe!')
          }
          let grade = new Schema.Grades({
            name: request.body.name
          })
          return grade.save()
        })
        .then((data) => {
          response.send(data)
        })
        .catch((error) => {
          next(error)
        })
    })

  /*
  * @api {get} / Obtener todos los grados
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  gradeURI.get('/', function (request, response, next) {
    Schema.Grades.find().then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} /:id Obtener un grado especifico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  gradeURI.get('/:id', function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    Schema.Grades.findOne({_id: request.params.id}).then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el grado!')
			}
			return Promise.all([
				data,
				Schema.Students.find({"grade._id": ObjectId(data._id)})
			]);
		})
		.then((data) => {
			var _grade = data[0].toJSON();
			_grade.students = data[1];
			return _grade;
		})
		.then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /:id Editar un grado
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  gradeURI.put('/:id', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (Validator.isNull()(request.body.name)) {
        throw new ValidatorException(
          'El nombre solo debe contener letras o numeros'
        )
      }
      if (!Validator.isMongoId()(request.params.id)) {
        throw new ValidatorException('El id es invalido')
      }
      Schema.Grades.findOne({_id: request.params.id}).then((data) => {
        if (!data) {
          throw new ValidatorException('No existe el grado!')
        }
        data.name = request.body.name
        return data.save()
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      })
    })

  /*
  * @api {delete} /:id Eliminar un grado
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  gradeURI.delete('/:id', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      Schema.Grades.findOne({_id: request.params.id}).then((data) => {
        if (!data) {
          throw new ValidatorException('No existe el grado!')
        }
        return data.remove()
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      })
    })

  app.use('/v1/grades', gradeURI)

  /*
  * Ruta /v1/courses
  * @var courseURI object enrutador para agrupar metodos
  */
  var courseURI = express.Router()

  /*
  * @api {post} / Crear materia
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  courseURI.post('/', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (Validator.isNull()(request.body.name)) {
        throw new ValidatorException('El nombre solo debe contener letras')
      }
			if (Validator.isNull()(request.body.description)) {
        throw new ValidatorException('Es necesario una descripción!')
      }
			if (!Validator.isJSON()(request.body.words)) {
        throw new ValidatorException('Los conceptos son invalidos!')
			}
			request.body.words = JSON.parse(request.body.words);
      Schema.Courses.findOne({name: request.body.name.toUpperCase()})
      .then((data) => {
        if (data) {
          throw new ValidatorException('Ya existe el nombre de la materia')
        }
        let course = new Schema.Courses({
					name: request.body.name,
					description: request.body.description,
					words: request.body.words
        })
        return course.save()
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      })
    })

  /*
  * @api {get} / Obtener todas las materias
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  courseURI.get('/', function (request, response, next) {
    Schema.Courses.find().then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })
  /*
  * @api {get} /:id Obtener una materia
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  courseURI.get('/:id', function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
		Schema.Courses.findOne({_id: request.params.id})
		.populate("words")
		.then((data) => {
      if (!data) {
        throw new ValidatorException('No existe la materia!')
      }
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })
  /*
  * @api {put} /:id Editar materia
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  courseURI.put('/:id', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (Validator.isNull()(request.body.name)) {
        throw new ValidatorException('El nombre solo debe contener letras')
      }
      Schema.Courses.findOne({_id: request.params.id}).then((obj) => {
        if (!obj) {
          throw new ValidatorException('No existe la materia!')
        }
        obj.name = request.body.name
        return obj.save()
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      })
    })

  /*
  * @api {delete} /:id Eliminar una materia
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  courseURI.delete('/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    Schema.Courses.findOne({_id: request.params.id}).then((data) => {
      if (!data) {
        throw new ValidatorException('No existe la materia!')
      }
      return data.remove()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  app.use('/v1/courses', courseURI)

  /*
  * Ruta /v1/learning
  * @var learningURI object enrutador para agrupar metodos
  */
  var learningURI = express.Router()

  /*
  * Ruta /v1/learning/domain

  * @api {post} / Crear dominio del aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  * @var category<CategoryCoginitions> objeto CRUD
  */
  learningURI.post('/', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (Validator.isNull()(request.body.name)) {
        throw new ValidatorException('Solo se aceptan textos categoricos')
      }
      if (Validator.isNull()(request.body.description)) {
        throw new ValidatorException('Es necesaria una descripción!')
      }
      if (!Validator.isJSON()(request.body.words)) {
        throw new ValidatorException('No posee conceptos validos!')
			}
			request.body.words = JSON.parse(request.body.words);
      Schema.domainsLearning.findOne({name: request.body.name.toUpperCase()})
      .then((data) => {
        let DomainLearning = Schema.domainsLearning
        if (data) {
          throw new ValidatorException('Ya existe ')
        }
        let domain = new DomainLearning({
          name: request.body.name,
					description: request.body.description,
					words: request.body.words
				});
        return domain.save()
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      })
    })

  /*
  * @api {get} / Obtener todas los dominios del aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  learningURI.get('/', function (request, response, next) {
    Schema.domainsLearning.find().then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} /:name Obtener un dominio del aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  learningURI.get('/:id', function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    Schema.domainsLearning.findOne({_id: request.params.id}).populate("words").then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el dominio!')
      }
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /:id Editar un dominio del aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  learningURI.put('/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    if (request.body.name && Validator.isNull()(request.body.name)) {
      throw new ValidatorException('Solo se aceptan textos categoricos')
    }
    if (request.body.description &&
    Validator.isNull()(request.body.description)) {
      throw new ValidatorException('Solo se aceptan textos categoricos')
		}
    if(request.body.words){
			request.body.words = JSON.parse(request.body.words);
			for (var i = 0, n = request.body.words.length; i<n; i++){
				request.body.words[i] = request.body.words[i].toUpperCase().trim();
			}
    }
    Schema.domainsLearning.findOne({_id: request.params.id}).then((row) => {
      if (!row) {
        throw new ValidatorException('No existe el dominio!')
      }
      for (var i in row.schema.obj) {
        if (request.body[i]) {
          row[i] = request.body[i];
        }
      }
      return row.save()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })
  /*
  * @api {delete} /:id Eliminar una categoria cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  learningURI.delete('/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    Schema.domainsLearning.findOne({_id: request.params.id}).then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el dominio!')
      }
      return data.remove()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  app.use('/v1/learning/domain', learningURI)

  /*
  * Ruta /v1/knowedge
  * @var cognitions object enrutador para agrupar metodos
  */
  var cognitions = express.Router()

  /*
  * @api {post} /cognitions Crear funcion cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  * @var category<CategoryCoginitions> objeto CRUD
  */
  cognitions.post('/cognitions', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (Validator.isNull()(request.body.name)) {
      throw new ValidatorException('Solo se aceptan textos categoricos!')
    }
    if (Validator.isNull()(request.body.description)) {
      throw new ValidatorException('Es necesario una breve descripción!')
    }
    if (!Validator.isJSON()(request.body.words)) {
      throw new ValidatorException('Los conceptos no son validos!')
		}
		request.body.words = JSON.parse(request.body.words);
    Schema.Cognitions.findOne({name: request.body.name.toUpperCase()})
    .then((row) => {
        if(row){
          throw new ValidatorException("Ya existe el registro!");
        }
        var cognition = new Schema.Cognitions({
          name: request.body.name.toUpperCase(),
					description: request.body.description.toUpperCase(),
					words: request.body.words
        });
        return cognition.save();
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} /cognitions Obtener todas las funcion cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.get('/cognitions',
  function (request, response, next) {
    Schema.Cognitions.find().then((row) => {
      response.send(row)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} /cognitions/:id Obtener funcion cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.get('/cognitions/:id', function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id no es valido!')
    }
		Schema.Cognitions.findOne({ _id: ObjectId(request.params.id) }).populate("words").then((row) => {
      if(!row){
        throw new ValidatorException("No existe el registro!");
      }
      response.send(row)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /cognitions/:id Editar funcion cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.put('/cognitions/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    if (!Validator.isNull()(request.body.words)) {
      throw new ValidatorException('Este campo no es valido!')
    }
    Schema.Cognitions.findOne({_id: request.params.id}).then((row) => {
      if(row){
        throw new ValidatorException("No existe el registro!");
      }
      for (var i in row.schema.obj) {
        if (request.body[i]) {
          row[i] = request.body[i]
        }
      }
      return row.save();
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {delete} /cognitions/:id Eliminar una funcion cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.delete('/cognitions/:id', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (!Validator.isMongoId()(request.params.id)) {
        throw new ValidatorException('El id es invalido!')
      }
      Schema.Cognitions.findOne({_id: request.params.id}).then((row) => {
          if(!row){
            throw new ValidatorException("No existe el registro!");
          }
          return row.remove();
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      });
    })

  /*
  * @api {post} / Crear un nivel de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.post('/:domain/level/', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (Validator.isNull()(request.body.name)) {
        throw new ValidatorException('Solo se aceptan textos categoricos')
      }
      if (Validator.isNull()(request.body.description)) {
        throw new ValidatorException('Es necesaria una descripción')
      }
      if (!Validator.isNumeric()(request.body.level)) {
        throw new ValidatorException('El nivel es numerico')
      }
      if (!Validator.isJSON()(request.body.words)) {
        throw new ValidatorException('Conceptos no validos!')
			}
			request.body.words = JSON.parse(request.body.words);
      Schema.domainsLearning.findOne({_id: ObjectId(request.params.domain)})
      .then((row) => {
				if(!row){
					throw new ValidatorException("No existe el dominio!");
				}
        let Domain = Schema.nivelDomain
        var level = new Domain({
          name: request.body.name.toUpperCase(),
					level: request.body.level,
					description: request.body.description,
					words: request.body.words
        });
        row.levels.forEach((level2) => {
          if (level2.level === level.level || level2.name === level.name) {
            throw new ValidatorException('Ya existe un nivel similar!')
          }
        })
        row.levels.push(level)
        return row.save()
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      })
    })

  /*
  * @api {get} / Obtener todas los niveles de aprendizaje de un dominio
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.get('/:domain/level/',
    function (request, response, next) {
      if (Validator.isNull()(request.params.domain)) {
        throw new ValidatorException('Solo se aceptan dominios validos')
      }
      Schema.domainsLearning.findOne({name: request.params.domain.toUpperCase()})
      .then((data) => {
        response.send(data.levels)
      }).catch((error) => {
        next(error)
      })
    })

  /*
  * @api {get} /:name Obtener una categoria cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.get('/:domain/level/:id', function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id no es valido!')
    }
		Schema.domainsLearning.findOne({name: request.params.domain.toUpperCase()})
		.populate("levels.words")
    .then((data) => {
			if(!data){
				throw new ValidatorException("No existe el dominio!");
			}
      for (var i = 0, n = data.levels.length; i < n; i++) {
        if (data.levels[i]._id.toString() === request.params.id.toString()) {
          return data.levels[i]
        }
      }
      throw new VoidException('No existe un resultado')
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

	/*
  * @api {put} /:id Editar un dominio del aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
	cognitions.put('/:domain/level/:id/word', Auth.isAdmin.bind(Schema),
		function (request, response, next) {
			if (!Validator.isMongoId()(request.params.id)) {
				throw new ValidatorException('El id no es valido!')
			}
			if (Validator.isNull()(request.body.word)) {
				throw new ValidatorException('No se admiten nulos!');
			}
			Schema.domainsLearning.findOne({ name: request.params.domain.toUpperCase() })
				.then((data) => {
					for (var i = 0, n = data.levels.length; i < n; i++) {
						if (data.levels[i]._id.toString() === request.params.id.toString()) {
							return [data,i];
						}
					}
					throw new VoidException('No existe un resultado')
				}).then((data) => {
					var _text = request.body.word.toUpperCase().trim(), isAdd = true;
					for (var i = 0, n = data[0].levels[data[1]].words.length; i < n; i++){
						if (data[0].levels[data[1]].words[i] === _text){
							isAdd = false;
							break;
						}
					}
					if(isAdd){
						data[0].levels[data[1]].words.push(_text);
						for (var i = 0, n = data[0].words.length; i < n; i++) {
							if (data[0].words[i] === _text) {
								isAdd = false;
								break;
							}
						}
						if(isAdd){
							data[0].words.push(_text);
						}
					}
					return data[0].save();
				}).then((data) => {
					response.send(data)
				}).catch((error) => {
					next(error)
				})
		})
	/*
  * @api {put} /:id Editar un dominio del aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
	cognitions.delete('/:domain/level/:id/word/:word', Auth.isAdmin.bind(Schema),
		function (request, response, next) {
			if (!Validator.isMongoId()(request.params.id)) {
				throw new ValidatorException('El id no es valido!')
			}
			if (Validator.isNull()(request.params.word)) {
				throw new ValidatorException('No se admiten nulos!');
			}
			Schema.domainsLearning.findOne({ name: request.params.domain.toUpperCase() })
				.then((data) => {
					for (var i = 0, n = data.levels.length; i < n; i++) {
						if (data.levels[i]._id.toString() === request.params.id.toString()) {
							return [data,i];
						}
					}
					throw new VoidException('No existe un resultado')
				}).then((data) => {
					var _text = request.params.word.toUpperCase().trim(), isAdd = true;
					data[0].levels[data[1]].words = data[0].levels[data[1]].words.filter((row) => {
						return row != request.params.word;
					});
					data[0].words = data[0].words.filter((row) => {
						return row != request.params.word;
					});
					return data[0].save();
				}).then((data) => {
					response.send(data)
				}).catch((error) => {
					next(error)
				})
		})
	/*
  * @api {put} /:id Editar un dominio del aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
	cognitions.put('/:domain/level/:id', Auth.isAdmin.bind(Schema),
		function (request, response, next) {
			if (!Validator.isMongoId()(request.params.id)) {
				throw new ValidatorException('El id no es valido!')
			}
			if (!Validator.isJSON()(request.body.words)) {
				throw new ValidatorException('No posee un formato valido!');
			}
			request.body.words = JSON.parse(request.body.words);
			Schema.domainsLearning.findOne({ name: request.params.domain.toUpperCase() })
				.then((data) => {
					for (var i = 0, n = data.levels.length; i < n; i++) {
						if (data.levels[i]._id.toString() === request.params.id.toString()) {
							return [data,i];
						}
					}
					throw new VoidException('No existe un resultado')
				}).then((data) => {
					for (var i = 0, n = request.body.words.length; i < n; i++) {
						request.body.words[i] = request.body.words[i].toUpperCase().trim();
					}
					data[0].levels[data[1]].words = request.body.words;
					return data[0].save();
				}).then((data) => {
					response.send(data)
				}).catch((error) => {
					next(error)
				})
		})

  /*
  * @api {delete} /:id Eliminar un nivel de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.delete('/:domain/level/:id', Auth.isAdmin.bind(Schema),
    function (request, response, next) {
      if (!Validator.isMongoId()(request.params.id)) {
        throw new ValidatorException('EL id no es valido!')
      }
      Schema.domainsLearning.findOne({name: request.params.domain.toUpperCase()})
			.populate("words")
			.then((data) => {
        if (!data) {
          throw new ValidatorException('No existe el dominio!')
        }
        for (var i in data.levels) {
          if (data.levels[i]._id.toString() === request.params.id.toString()) {
            data.levels[i].remove()
            break
          }
        }
        return data.save()
      }).then((data) => {
        response.send(data)
      }).catch((error) => {
        next(error)
      })
    })

  /*
  * @api {post} /objetives/ Crear objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  * @var category<CategoryCoginitions> objeto CRUD
  */
	cognitions.post('/objetives/', Auth.isUser.bind(Schema),
  function (request, response, next) {
    if (Validator.isNull()(request.body.name)) {
      throw new ValidatorException('Es requerido un nombre')
    }
    if (Validator.isNull()(request.body.description)) {
      throw new ValidatorException('Es necesaria una description')
    }
    if (Validator.isJSON()(request.body.conditions)) {
      throw new ValidatorException('Las condiciones no son validas!')
    }
		if (request.body.exp
					&& !Validator.isNumeric(request.body.exp)) {
      throw new ValidatorException('Los puntos de exp deben ser numericos!');
		}
		if (request.body.exp
			&& parseFloat(request.body.exp) <= 0) {
			throw new ValidatorException('Los puntos de exp deben ser superiores a cero!');
		}
    	request.body.name = request.body.name.toUpperCase()
		request.body.description = request.body.description.toUpperCase()
		if (request.body.conditions){
			request.body.conditions = JSON.parse(request.body.conditions);
		}
		if (!request.body.exp){
			request.body.exp = 10; // evaluador principal
		}
		if (!request.body.words){
			request.body.words = [];
		}else{
			if (Validator.isJSON()(request.body.words)){
				request.body.words = JSON.parse(request.body.words);
			}else{
				request.body.words = WORDS.SeparatorWords(request.body.words);
			}
			request.body.words = request.body.words.map((row) => {
				return row.toUpperCase();
			})
		}
		//Las palabras son claves y accionables
		if (!request.body.is_correct){
			request.body.is_correct = true;
		}else{
			request.body.is_correct = request.body.is_correct == "true";			
		}
		//Los verbos son observables
		if (!request.body.is_observable){
			request.body.is_observable = true;
		}else{
			request.body.is_observable = request.body.is_observable == "true";			
		}
		var _words = WORDS.SeparatorWords(request.body.description);
		var _concepts = [], _pending = [],
				_radios = [], _morpholy = [],
				_conditions = [], _cognitions = [],
				_domains = [], _levels = [], _concepts_keywords = [],
				_verbs = [], _actions = [], _keywords = [];
		Schema.LearningObjetive.findOne({ name: request.body.name }).then((row) => {
			if (row) {
				throw new MachineError('Ya existe un objetivo con el mismo nombre!')
			}
			//procesando palabras claves
			var _queryWords = _words.map((row) => {
				return Schema.words.findOne({ key: row });
			});
			return Promise.all(_queryWords);
		})
		.then((words) => {
			_pending = WORDS.getPending(words, _pending, _words);
			if (_pending.length > 0 ) {
				Events.emit("new-words", _pending);
			}
			if(_pending.length == _words.length){
				throw new KeywordVoidException("No se pudo identificar una palabra clave!");
			}
			_morpholy = words;
			var querys = words.map((row) => {
				if(!row){
					return null;
				}
				return Schema.Hiperonimo.findOne({
					$or: [
						{ "hiponimos.key": row.key },
						{ "hiponimos.words": row.key }
					]
				});
			});
			var _ranges = words.map((row) => {
				if (!row){
					return null;
				}
				var exp = new RegExp(row.key, "ig");
				return Schema.LearningObjetive.find({ description: { $regex: exp} }).count();
			});
			return Promise.all([querys, Promise.all(_ranges), Schema.LearningObjetive.count()]);
		})
		.then((rows) => {
			var _ranges = rows[1], _count = rows[2], _MAX = 0;
			_concepts = rows[0];
			for(var i = 0, n = _ranges.length; i<n; i++){
				_radios[i] = 0;
				if(!_ranges[i]){
					continue;
				}
				if(_count >  0){
					_radios[i] = _ranges[i] /  _count;
				}
				_MAX = Math.max(_MAX, _radios[i]);
			}
			return Promise.all([
				Schema.events.findOne({ name: 'KEYWORDS-SEARCH' }),
				Schema.events.findOne({ name: 'KEYWORDS-IS' }),
				_MAX
			]);
		})
		.then((rows) => {
			var event = rows[0], eventTaxon = rows[1], _MAX = rows[2];
			if (!event) {
				/**
				 * q1: Es palabra clave
				 * q2: Es observable
				 * q3: Es Acción
				 * q10: Errores
				 */
				event = new Schema.events({
					name: 'KEYWORDS-SEARCH',
					objects: {
						p1: 'Palabra', // Palabra
						p2: 'radio texto', // Cantidad de repeticiones por objetivos
						p3: 'información lexica', // conceptos gramaticales
						p4: 'información semantica', // conceptos semanticos
					},
					premises: []
				});
				event.save();
			}
			if (!eventTaxon) {
				/**
				 * q4: condiciones
				 * q5: funciones cognitivas
				 * q6: dominios
				 * q7: niveles
				 * q8: errores
				 * q9: puntos de experiencia estimados
				*/
				eventTaxon = new Schema.events({
					name: 'KEYWORDS-IS',
					objects: {
						p1: 'Palabra', // Palabra
						p2: 'radio texto', // Cantidad de repeticiones por objetivos
						p3: 'información lexica', // conceptos gramaticales
						p4: 'información semantica', // conceptos semanticos
						q1: "ES PALABRA CLAVE",
						q2: "ES OBSERVABLE",
						q3: "ES ACCIÓN"
					},
					premises: []
				});
				eventTaxon.save();
			}
			var _verbs = [], actions = [];
			for(var i = 0, n = _morpholy.length; i<n; i++){
				if(!_morpholy[i]){
					continue;
				}
				var _taxons = _morpholy[i].concepts.map((row) => {
					return `${row.key}|${row.value}`;
				});
				var _value = {
					p1: _words[i],
					p2: _radios[i],
					p3: _taxons,
					p4: _concepts[i].concept
				};
				var _consecuents = Events.ChainGetAll(event.premises, _value);
				for(var k = 0, u = _consecuents.length; k<u; k++){
					var _consecuent = _consecuents[k];
					if (_consecuent.q10){
						throw new MachineError(_consecuent.q10);
					}
					if (_consecuent.q1){
						_keywords.push(_morpholy[i].key);
						_concepts_keywords.push(_morpholy[i]);
						_value.q1 = _consecuent.q1;
					}
					if (_consecuent.q2){
						_verbs.push({
							word: _morpholy[i],
							concept: _concepts[i],
							range: _radios[i]
						});
						_value.q2 = _consecuent.q2;
					}
					if (_consecuent.q3){
						_actions.push({
							word: _morpholy[i],
							concept: _concepts[i],
							range: _radios[i]
						});
						_value.q3 = _consecuent.q3;
					}
				}
				//_value = Object.assign(_value, _consecuent);
				var _consecuents = Events.ChainGetAll(eventTaxon.premises, _value);
				for(var j = 0, u = _consecuents.length; j < u; j++){
					if (_consecuents[j].q4 && _consecuents[j].h >= 0.5){
						_conditions.push(_consecuents[j].q4);
					}
					if (_consecuents[j].q5 && _consecuents[j].h >= 0.5){
						_cognitions.push(_consecuents[j].q5);
					}
					if (_consecuents[j].q6 && _consecuents[j].h >= 0.5){
						_domains.push({
							 _id: _consecuents[j].q6,
							 h: _consecuents[j].h
						});
					}
					if (_consecuents[j].q7 && _consecuents[j].h >= 0.5){
						_levels.push({
							 _id: _consecuents[j].q7,
							 h: _consecuents[j].h
						});
					}
					if (_consecuents[j].q8 && _consecuents[j].h >= 0.5){
						throw new MachineError(_consecuents[j].q8);
					}
					if (_consecuents[j].q9 && _consecuents[j].h >= 0.5){
						request.body.exp = parseFloat(_consecuents[j].q9);
					}
				}
			}
			var _domain, _level;
			if (_domains.length > 0){
				var _max = 0;
				for(var i = 0, n = _domains.length; i < n; i++){
					if(_max < _domains[i].h){
						_domain = _domains[i]._id;
						_max = _domains[i].h;
					}
				}
			}
			if (_levels.length > 0){
				var _max = 0;
				for(var i = 0, n = _levels.length; i < n; i++){
					if(_max < _levels[i].h){
						_level = _levels[i]._id;
						_max = _levels[i].h;
					}
				}
			}
			for(var k = 0, u = _morpholy.length; k < u; k++){
				if(!_morpholy[k]){
					continue;
				}
				var isExist = false;
				for(var j = 0, mk = _verbs.length; j<mk; j++){
					if(_verbs[j].word.key == _morpholy[k].key){
						isExist = true;
						break;
					}
				}
				if(isExist){
					continue;
				}
				for(var j = 0, mk = _actions.length; j<mk; j++){
					if(_actions[j].word.key == _morpholy[k].key){
						isExist = true;
						break;
					}
				}
				if(isExist){
					continue;
				}
				var isNotVerbose = true;
				for(var j = 0, mk = _morpholy[k].concepts.length; j<mk; j++){
					if(
						_morpholy[k].concepts[j].key == WORDS.CONCEPTS.CLASS
						&& _morpholy[k].concepts[j].value == WORDS.CLASS_GRAMATICAL.VERB){
						var _inference = new Schema.inferences({
							premise: `p1 == "${_morpholy[k].key}"`,
							consecuent: `q2 = true`,
							h: _radios[k]
						});
						event.premises.push(_inference);
						_verbs.push({
							word: _morpholy[k],
							concept: _concepts[k],
							range: _radios[k]
						});
						isNotVerbose = false;
						break;
					}
				}
				if(isNotVerbose){
					((_key, _concept, _range) => {
							Promise.all([
								Schema.domainsLearning.findOne({
									$or: [
										{ words: _concept._id},
										{ "levels.words": _concept._id}
									]
								}),
								Schema.Cognitions.findOne({ words: _concept._id}),
								Schema.Courses.findOne({ words: _concept._id})
							]).then((rows) => {
								var _q3 = false, _h = 0.5;
								for(var k = 0, m = rows.length; k < m; k++){
									_q3 = _q3 || !!rows;
								}
								if (_MAX > 0){
									_h = _range / _MAX;
								}
								var _inference = new Schema.inferences({
									premise: `p1 == "${_key.key}"`,
									consecuent: `q3 = ${_q3}`,
									h: _h
								});
								event.premises.push(_inference);
								event.save();
							});
						})(_morpholy[k], _concepts[k], _radios[k]);
				}
			}
			var _new_keys = [];
			for(var j = 0, m = request.body.words.length; j<m; j++){
				var isExist = false;
				for(var k = 0, u = _keywords.length; k<u; k++){
					if(request.body.words[j] == _keywords[k]){
						isExist = true;
						break;
					}
				}
				if(!isExist){
					var _q1 = request.body.is_correct;
					var _inference = new Schema.inferences({
						premise: `p1 == "${request.body.words[j]}"`,
						consecuent: `q1 = ${_q1}`,
						h: 0.55
					});
					event.premises.push(_inference);
					_new_keys.push(request.body.words[j]);
				}
			}
			request.body.words = _keywords.concat(_new_keys);
			if (!request.body.is_observable){
				for(var k = 0, u = _verbs.length; k<u; k++){
					var _inference = new Schema.inferences({
						premise: `p1 == "${_verbs[k].word.key}"`,
						consecuent: `q10 = "El verbo \\"${_verbs[k].word.key}\\" no es observable"`,
						h: 1 - _verbs[k].range
					});
					event.premises.push(_inference);
				}
			}
			eventTaxon.save();
			event.save();
			if(request.body.words.length == 0){
				throw new KeywordVoidException("No posee palabras claves!");
			}
			if(!request.body.is_correct || !request.body.is_observable){
				throw new MachineError("Anulado inserción de objetivo por el usuario!. Ajustes aplicados");				
			}
			if(request.body.domain){
				for(var j = 0, n = _verbs.length; j<n; j++){
					var _inference = new Schema.inferences({
						premise: `p1 == "${_verbs[j].word.key}" && q2 == true`,
						consecuent: `q6 = "${request.body.domain}"`,
						h: _verbs[j].range
					});
					eventTaxon.premises.push(_inference);
				}
				_domain = request.body.domain;
			}
			if(request.body.level){
				for(var j = 0, n = _verbs.length; j<n; j++){
					var _inference = new Schema.inferences({
						premise: `p1 == "${_verbs[j].word.key}" && q2 == true`,
						consecuent: `q7 = "${request.body.level}"`,
						h: _verbs[j].range
					});
					eventTaxon.premises.push(_inference);					
				}
				_level = request.body.level;
			}
			eventTaxon.save();
			event.save();
			if (!_domain || !_level){
				throw new ValidatorException("No existe una acción observable");
			}
			try{
				return Promise.all([
					Schema.domainsLearning.findOne({ _id: ObjectId(_domain)}),
					_level
				]);
			}catch(error){
					return Promise.all([
						Schema.domainsLearning.findOne({ name: _domain}),
						_level
					]);
			}
		})
		.then((data) => {
			if(!data[0]){
				throw new ValidatorException("No existe el dominio seleccionado!");
			}
			var _level;
			for(var i = 0, n = data[0].levels.length; i<n; i++){
				if (data[0].levels[i]._id.toString() == data[1]){
					_level = data[0].levels[i];
					break;
				}
			}
			if (!_level) {
				throw new ValidatorException("No existe el nivel dentro del dominio!");
			}
			var p1 = new Schema.LearningObjetive({
				name: request.body.name,
				description: request.body.description,
				domain: data[0],
				level: _level,
				words: request.body.words,
				cognitions: _cognitions,
				exp: request.body.exp,
				conditions: _conditions
			});
			return p1.save();
		})
		.then((data) => {
			var _body = data.toJSON();
			_body.pending = _pending;
			response.send(_body);
		})
		.catch((error) => {
			error.message = {
				keywords: _pending,
				message: error.message
			}
			next(error)
		})
	});
  /*
  * @api {post} /objetives/ Crear objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  * @var category<CategoryCoginitions> objeto CRUD
  */
	cognitions.post('/objetives/datas', Auth.isUser.bind(Schema),
  function (request, response, next) {
			if (Validator.isNull()(request.body.key)){
				throw new ValidatorException("Es necesario la palabra ha evaluar!");
			}
			request.body.key = request.body.key.toUpperCase();
			request.body.is_observable = request.body.is_observable == "true";
			request.body.is_correct = request.body.is_correct == "true";
			var event;
			Promise.all([
				Schema.events.findOne({ name: 'KEYWORDS-SEARCH' }),
				Schema.events.findOne({ name: 'KEYWORDS-IS' })				
			])
			.then((rows) => {
				event = rows[0];
				if (!event) {
					/**
					 * q1: Es palabra clave
					 * q2: Es observable
					 * q3: Es Acción
					 * p5: Es contenido
					 * q10: Errores
					 */
					event = new Schema.events({
						name: 'KEYWORDS-SEARCH',
						objects: {
							p1: 'Palabra', // Palabra
							p2: 'radio texto', // Cantidad de repeticiones por objetivos
							p3: 'información lexica', // conceptos gramaticales
							p4: 'información semantica', // conceptos semanticos
						},
						premises: []
					});
					event.save();
				}
				var exp = new RegExp(request.body.key, "ig");
				return Promise.all([
					Schema.words.findOne({ key: request.body.key }),
					Schema.Hiperonimo.find({
						$or: [
							{ "hiponimos.key": request.body.key },
							{ "hiponimos.words": request.body.key }
						]
					}),
					Schema.LearningObjetive.count(),
					Schema.LearningObjetive.find({ description: { $regex: exp } }).count(),
				])
			})
			.then((datas) => {
				var _word = datas[0], _hiperonimos = datas[1], _count = datas[2], _range = 0;
				var _isVerb = false;
				if(_count > 0){
					_range = datas[3] / _count;
				}
				for(var i = 0, n = _word.concepts.length; i<n; i++){
					var _concept = _word.concepts[i];
					if(_concept.value == WORDS.CLASS_GRAMATICAL.VERB){
						_isVerb = true;
						break;
					}
				}
				var _queryDomains = _hiperonimos.map((row) => {
					return {
						$or: [
							{ words: row._id },
							{ "levels.words": row._id }
						]
					}
				}), _queryCognition = _hiperonimos.map((row) => {
					return {words: row._id};
				}), _queryCourses = _hiperonimos.map((row) => {
					return {words: row._id};
				});
				var _query1 = 0, _query2 = 0, _query3 = 0;
				if (_queryDomains.length > 0) {
					_query1 = Schema.domainsLearning.findOne({
						$or: _queryDomains
					}).count();
				}
				if (_queryCognition.length > 0) {
					_query2 = Schema.Cognitions.findOne({
						$or: _queryCognition
					}).count();
				}
				if (_queryCourses.length > 0) {
					_query3 = Schema.Courses.findOne({
						$or: _queryCourses
					}).count();
				}
				return Promise.all([
					datas,
					_range,
					_isVerb,
					Promise.all([
						_query1,
						_query2,
						_query3
					])
				]);
			})
			.then((datas) => {
				var _word = datas[0][0], _hiperonimos = datas[0][1], _count = datas[0][2], _range = datas[1], _containers = datas[3];
				var _isVerb = datas[2];
				var _q3 = false, _p5 = datas[2][2] > 0;
				for(var i = 0, n = _containers.length; i<n; i++){
					_q3 = _q3 || _containers[i] > 0;
				}
				var _taxons = _word.concepts.map((row) => {
					return `${row.key}|${row.value}`;
				});
				var _concepts_val = _hiperonimos.map((row) => {
					return row.concept;
				}).join("|");
				var _value = {
					p1: _word.key,
					p2: _range,
					p3: _taxons,
					p4: _concepts_val
				};
				var _presupuesto = (_q3 && request.body.is_observable) || request.body.is_correct;
				if (!_presupuesto && !request.body.is_observable){
					_range = 1 - _range;
				}
				var _vars = {}, _basuras = [], _isDelete = false;
				for (var j = 0, n = event.premises.length; j<n; j++){
					var _consecuents = Events.ChainGetOne([event.premises[j]], _value, true);
					if (!_consecuents){
						continue;
					}
					if (event.premises[j].h < 0.5) {
						if (_consecuents.q1 != undefined){
							event.premises[j].consecuent = `q1 = ${_presupuesto}`;
						}
						if (_consecuents.q2 != undefined){
							event.premises[j].consecuent = `q2 = ${request.body.is_observable}`;							
							if (_isVerb && request.body.is_observable){
								_isDelete = true;
							}
						}
						if (_consecuents.q3 != undefined){
							event.premises[j].consecuent = `q3 = ${_q3}`;
						}
						if (_consecuents.p5 != undefined){
							event.premises[j].consecuent = `p5 = ${_p5}`;
						}
						if (_consecuents.q10 != undefined){
							event.premises[j].consecuent = `q10 = "El verbo \\"${request.body.key}\\" no es observable"`;
							if (_isDelete){
								_basuras.push(j);
							}
						}
						event.premises[j].h = _range;
						_vars = Object.assign(_consecuents, _vars);
					}
				}
				while (_basura = _basuras.pop()){
					event.premises[_basura].remove();
				}
				if(_vars.q1 == undefined){
					event.premises.push(new Schema.inferences({
						premise: `p1 == "${request.body.key}"`,
						consecuent: `q1 = ${_presupuesto}`,
						h: _range
					}));
				}
				if(_vars.q2 == undefined){
					event.premises.push(new Schema.inferences({
						premise: `p1 == "${request.body.key}"`,
						consecuent: `q2 = ${request.body.is_observable}`,
						h: _range
					}));
				}
				if(_vars.q3 == undefined){
					event.premises.push(new Schema.inferences({
						premise: `p1 == "${request.body.key}"`,
						consecuent: `q3 = ${_q3}`,
						h: _range
					}));
				}
				if(_vars.p5 == undefined){
					event.premises.push(new Schema.inferences({
						premise: `p1 == "${request.body.key}"`,
						consecuent: `p5 = ${_p5}`,
						h: _range
					}));
				}
				if (_vars.q10 == undefined && _isVerb && !request.body.is_observable){
					event.premises.push(new Schema.inferences({
						premise: `p1 == "${request.body.key}"`,
						consecuent: `q10 = "El verbo \\"${request.body.key }\\" no es observable"`,
						h: _range
					}));
				}
				return event.save();
			})
			.then((data) => {
				response.send(data);
			})
			.catch((error) => {
				console.log(error);
				next(error)
			})
	});
  /*
  * @api {post} /objetives/ Crear objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  * @var category<CategoryCoginitions> objeto CRUD
  */
	cognitions.post('/objetives/exp', Auth.isUser.bind(Schema),
  function (request, response, next) {
			if (!Validator.isJSON()(request.body.words)){
				throw new ValidatorException("Es necesario una palabra");
			}
			if (!Validator.isNumeric()(request.body.exp)){
				throw new ValidatorException("Los puntos de experiencias debe ser un número");
			}
			request.body.words = JSON.parse(request.body.words).map((row) => {
				return row.toUpperCase();
			});
			request.body.exp = parseFloat(request.body.exp);
			if (request.body.exp <= 0 && request.body.exp > 100){
				throw new ValidatorException("Los puntos de experiencias debe ser en una escala mayor a cero hasta el 100");
			}
			var exp = new RegExp(request.body.words.join("|"), "ig");
			var event;
			Promise.all([
				Schema.events.findOne({ name: 'KEYWORDS-IS' }),
				Schema.LearningObjetive.count(),
				Schema.LearningObjetive.find({ description: { $regex: exp } }).count()
			])
			.then((rows) => {
				var _count = rows[1], _range = 0;
				event = rows[0];
				if (_count > 0) {
					_range = rows[2] / _count;
				}
				if (!event) {
					/**
					 * q4: condiciones
					 * q5: funciones cognitivas
					 * q6: dominios
					 * q7: niveles
					 * q8: errores
					 * q9: puntos de experiencia estimados
					*/
					event = new Schema.events({
						name: 'KEYWORDS-IS',
						objects: {
							p1: 'Palabra', // Palabra
							p2: 'radio texto', // Cantidad de repeticiones por objetivos
							p3: 'información lexica', // conceptos gramaticales
							p4: 'información semantica', // conceptos semanticos
							q1: "ES PALABRA CLAVE",
							q2: "ES OBSERVABLE",
							q3: "ES ACCIÓN"
						},
						premises: []
					});
					event.save();
				}
				event.premises.push(new Schema.inferences({
					premise: `this.isContaint(p1, ${JSON.stringify(request.body.words)}) == true`,
					consecuent: `q9 = ${request.body.exp}`,
					h: _range
				}));
				return event.save();
			})
			.then((data) => {
				response.send(data);
			})
			.catch((error) => {
				next(error)
			})
	});
/*
* @api {get} /objetives Obtener todos los objetivos
* y dominio valido
* @params request peticiones del cliente
* @params response respuesta del servidor
* @params next middleware dispara la proxima funcion
*/
  cognitions.get('/objetives',
  function (request, response, next) {
    Schema.LearningObjetive.find().then((rows) => {
      response.send(rows)
    }).catch((error) => {
      next(error)
    })
  })

/*
* @api {get} /:domain/objetives/:level Obtener todos los objetivos de un nivel
* y dominio valido
* @params request peticiones del cliente
* @params response respuesta del servidor
* @params next middleware dispara la proxima funcion
*/
  cognitions.get('/:domain/objetives/:level',
  function (request, response, next) {
    Schema.LearningObjetive.find({
      'domain.name': request.params.domain.toString(),
      'level.name': request.params.level.toString()
    }).then((rows) => {
      response.send(rows)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} / Obtener un objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.get('/objetives/:id',
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
		Schema.LearningObjetive.findOne({_id: request.params.id})
		.populate("cognitions")
		.then((rows) => {
      if (!rows) {
        throw new ValidatorException('No existe el objetivo de aprendizaje')
      }
      response.send(rows)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} / Obtener todos los objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.get('/objetives',
  function (request, response, next) {
    Schema.LearningObjetive.find().then((rows) => {
      response.send(rows)
    }).catch((error) => {
      next(error)
    })
  })
  /*
  * @api {get} / Obtener todos los objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.get('/objetives/:id/cognitions',
  function (request, response, next) {
		if (!Validator.isMongoId()(request.params.id)) {
			throw new ValidatorException('El id es invalido!')
		}
		var _rules, _RULES_ADD, _morphology, _objetive;
		Promise.all([
			Schema.events.findOne({ name: 'KEYWORDS-IS' }),
			Schema.LearningObjetive.findOne({ _id: ObjectId(request.params.id) }),
			Schema.events.findOne({ name: 'KEYWORDS-SEARCH' })
		]).
		then((rows) => {
			_rules = rows[2];
			_RULES_ADD = rows[0];
			if (!_rules) {
				/**
				 * q1: Es palabra clave
				 * q2: Es observable
				 * q3: Es Acción
				*/
				_rules = new Schema.events({
					name: 'KEYWORDS-SEARCH',
					objects: {
						p1: 'Palabra', // Palabra
						p2: 'radio texto', // Cantidad de repeticiones por objetivos
						p3: 'información lexica', // conceptos gramaticales
						p4: 'información semantica', // conceptos semanticos
					},
					premises: []
				});
				_rules.save();
			}
			if (!_RULES_ADD) {
				/**
				 * q4: condiciones
				 * q5: funciones cognitivas
				 * q6: dominios
				 * q7: niveles
				 * q8: errores
				 * q9: puntos de experiencia estimados
				*/
				_RULES_ADD = new Schema.events({
					name: 'KEYWORDS-IS',
					objects: {
						p1: 'Palabra', // Palabra
						p2: 'radio texto', // Cantidad de repeticiones por objetivos
						p3: 'información lexica', // conceptos gramaticales
						p4: 'información semantica', // conceptos semanticos
						q1: "ES PALABRA CLAVE",
						q2: "ES OBSERVABLE",
						q3: "ES ACCIÓN"
					},
					premises: []
				});
				_RULES_ADD.save();
			}
			if (!rows[1]) {
				throw new ValidatorException('No existe el objetivo!')
			}
			_objetive = rows[1];
			var _premises = _objetive.words.map((row) => {
				if (!row) {
					return null;
				}
				return Schema.words.findOne({ key: row });
			});
			return Promise.all(_premises);
		})
		.then((words) => {
			_morphology = words;
			var querys = words.map((row) => {
				if (!row) {
					return null;
				}
				return Schema.Hiperonimo.findOne({
					$or: [
						{ "hiponimos.key": row.key },
						{ "hiponimos.words": row.key }
					]
				});
			});
			return Promise.all(querys);
		})
		.then((hiperonimos) => {
			var _queryCognition = hiperonimos.map((row) => {
				if(!row){
					return null;
				}
				return { words: row._id };
			});
			_queryCognition = _queryCognition.filter((row) => {
				return !!row;
			})
			return Schema.Cognitions.find({ $or: _queryCognition});
		})		
    .then((rows) => {
			var _body = rows.filter((row) => {
				for(var i = 0, n = _objetive.cognitions.length; i<n; i++){
					if (_objetive.cognitions[i].toString() == row._id.toString()){
						return false;
					}
				}
				return true;
			});
			response.send(_body);
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /objetives/:id Editar un objetivo
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.put('/objetives/:id',
  Auth.isAdmin.bind(Schema), function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
		}
    Schema.LearningObjetive.findOne({
      _id: request.params.id
    }).then((row) => {
      for (var i in row.schema.obj) {
        if (request.body[i]) {
          row[i] = request.body[i]
        }
      }
      return row.save()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    });
  })

  /*
  * @api {put} /:id Editar categoria cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.put('/objetives/:id/cognitions',
  Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    if(!Validator.isJSON()(request.body.data)){
      throw new ValidatorException("No es valido el objeto!");
    }
		var _objetive, _rules, _cognitions = [],
			_morphology = [], _concepts = [],
			_radios = [], _RULES_ADD= [];
		request.body.data = JSON.parse(request.body.data);
		var _cognitions = request.body.data.map((cognition) => {
			if (!Validator.isMongoId()(cognition)) {
				throw new ValidatorException('El id es invalido!')
			}
			return Schema.Cognitions.findOne({ _id: cognition });
		});
		Promise.all([
			Schema.events.findOne({ name: 'KEYWORDS-IS' }),
			Schema.LearningObjetive.findOne({ _id: ObjectId(request.params.id) }),
			Promise.all(_cognitions),
			Schema.events.findOne({ name: 'KEYWORDS-SEARCH' })
		])
		.then((rows) => {
			_rules = rows[3];
			_RULES_ADD = rows[0];
			if (!_rules) {
				/**
				 * q1: Es palabra clave
				 * q2: Es observable
				 * q3: Es Acción
				*/
				_rules = new Schema.events({
					name: 'KEYWORDS-SEARCH',
					objects: {
						p1: 'Palabra', // Palabra
						p2: 'radio texto', // Cantidad de repeticiones por objetivos
						p3: 'información lexica', // conceptos gramaticales
						p4: 'información semantica', // conceptos semanticos
					},
					premises: []
				});
				_rules.save();
			}
			if (!_RULES_ADD) {
				/**
				 * q4: condiciones
				 * q5: funciones cognitivas
				 * q6: dominios
				 * q7: niveles
				 * q8: errores
				 * q9: puntos de experiencia estimados
				*/
				_RULES_ADD = new Schema.events({
					name: 'KEYWORDS-IS',
					objects: {
						p1: 'Palabra', // Palabra
						p2: 'radio texto', // Cantidad de repeticiones por objetivos
						p3: 'información lexica', // conceptos gramaticales
						p4: 'información semantica', // conceptos semanticos
						q1: "ES PALABRA CLAVE",
						q2: "ES OBSERVABLE",
						q3: "ES ACCIÓN"
					},
					premises: []
				});
				_RULES_ADD.save();
			}
			if (!rows[1]) {
				throw new ValidatorException('No existe el objetivo!')
			}
			_objetive = rows[1];
			_cognitions = rows[2];
			_objetive.cognitions.forEach((row2) => {
				_cognitions.forEach((_cognition) => {
					if (row2._id == _cognition._id) {
						throw new ValidatorException(`ya existe la función cognitiva ${_cognition.name}`)
					}
				})
			});
			var _premises = _objetive.words.map((row) => {
				if (!row) {
					return null;
				}
				return Schema.words.findOne({ key: row });
			});
			return Promise.all(_premises);
		})
		.then((words) => {
			_morphology = words;
			var querys = words.map((row) => {
				if (!row) {
					return null;
				}
				return Schema.Hiperonimo.findOne({
					$or: [
						{ "hiponimos.key": row.key },
						{ "hiponimos.words": row.key }
					]
				});
			});
			var _ranges = words.map((row) => {
				if(!row){
					return null;
				}
				var exp = new RegExp(row.key, "ig");
				return Schema.LearningObjetive.find({ description: { $regex: exp } }).count();
			});
			return Promise.all([querys, Promise.all(_ranges), Schema.LearningObjetive.count()]);
		})
		.then((rows) => {
			var _ranges = rows[1], _count = rows[2], _MAX = 0;
			_concepts = rows[0];
			for (var i = 0, n = _ranges.length; i < n; i++) {
				_radios[i] = 0;
				if (!_ranges[i]) {
					continue;
				}
				if (_count > 0) {
					_radios[i] = _ranges[i] / _count;
				}
				_MAX = Math.max(_MAX, _radios[i]);
			}
			for (var i = 0, n = _morphology.length; i < n; i++) {
				if (!_morphology[i]) {
					continue;
				}
				var _taxons = _morphology[i].concepts.map((row) => {
					return `${row.key}|${row.value}`;
				});
				var _value = {
					p1: _morphology[i].key,
					p2: _radios[i],
					p3: _taxons,
					p4: _concepts[i].concept
				};
				var isAdd = true;
				var _consecuent = Events.ChainGetOne(_rules.premises, _value);
				_value = Object.assign(_value, _consecuent);
				var _consecuents = Events.ChainGetAll(_RULES_ADD.premises, _value);
				if (!_consecuent.q3){
					isAdd = false;
				}
				for(var k = 0, u = _cognitions.length; k < u; k++){
					if(_consecuent.q3){
						for (var j = 0, m = _consecuents.length; j < m; j++){
							if (_consecuents[j].q5 == _cognitions[k]._id.toString()){
								isAdd = false;
								break;
							}
						}
					}
					if(isAdd){
						var _h = 0.5;
						if (_MAX > 0){
							_h = _radios[i] / _MAX
						}
						var _inference = new Schema.inferences({
							premise: `p1 == "${_morphology[i].key}"`,
							consecuent: `q5 = "${_cognitions[k]._id}"`,
							h: _h
						});
						_RULES_ADD.premises.push(_inference);
					}
					_RULES_ADD.save();
				}
			}
			for(var i = 0, n = _cognitions.length; i<n; i++){
				_objetive.cognitions.push(_cognitions[i]._id);
			}
			return _objetive.save();
		})
		.then((data) => {
			response.send(data);
		}).catch((error) => {
			next(error)
		})
	})

  /*
  * @api {delete} /:id Eliminar una categoria cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
	cognitions.delete('/objetives/:id/cognition/:cognition', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    if (!Validator.isMongoId()(request.params.cognition)) {
      throw new ValidatorException('El id es invalido!')
    }
    Schema.LearningObjetive.findOne({
      _id: ObjectId(request.params.id)
    }).then((obj) => {
      if (!obj) {
        throw new ValidatorException('No existe el objetivo')
			}
			var isExist = false;
			obj.cognitions = obj.cognitions.filter((row) => {
				var _bool = row.toString() != request.params.cognition;
				if (!_bool){
					isExist = true;
				}
				return _bool;
			});
			if (!isExist){
				throw new ValidatorException('No existe la función cognitiva');
			}
			return obj.save();
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
	})
	
  /*
  * @api {delete} /:id Eliminar una categoria cognitiva
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  cognitions.delete('/objetives/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('El id es invalido!')
    }
    Schema.LearningObjetive.findOne({
      _id: ObjectId(request.params.id)
    }).then((obj) => {
      if (!obj) {
        throw new ValidatorException('No existe el objetivo')
      }
      return obj.remove()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  app.use('/v1/knowedge', cognitions)

  var weightURI = express.Router()
  /*
  * Ruta /v1/physic/static/weight

  * @api {post} / Crear un peso estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  weightURI.post('/', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isFloat()(request.body.age) || !Validator.isFloat()(request.body.min) || !Validator.isFloat()(request.body.max)) {
      throw new ValidatorException('Solo se aceptan numeros')
    }
    if ((request.body.max - request.body.min) <= 0 || request.body.min === 0 || request.body.max === 0) {
      throw new ValidatorException('El rango de pesos es invalido')
    }
    if (request.body.genero && request.body.genero.toUpperCase() !== 'MASCULINO' && request.body.genero.toUpperCase() !== 'FEMENINO') {
      throw new ValidatorException('El genero es invalido')
    }
    var genero = request.body.genero.toUpperCase()
    Schema.weights.findOne({age: request.body.age, genero: genero})
    .then((data) => {
      if (data) {
        throw new ValidatorException('Ya existe un registro similar!')
      }
      let Weights = Schema.weights
      let weight = new Weights({
        age: request.body.age,
        min: request.body.min,
        max: request.body.max,
        genero: genero
      })
      return weight.save()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} / Obtener todas los pesos estaticos
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  weightURI.get('/', function (request, response, next) {
    Schema.weights.find().then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} /:name Obtener un peso estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  weightURI.get('/:id', function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('EL id no es valido')
    }
    Schema.weights.findOne({_id: request.params.id})
    .then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el peso!')
      }
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /:id Editar peso estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  weightURI.put('/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('EL id no es valido')
    }
    if ((request.body.height && !Validator.isFloat()(request.body.height)) || (request.body.min && !Validator.isFloat()(request.body.min)) || (request.body.max && !Validator.isFloat()(request.body.max))) {
      throw new ValidatorException('Solo se aceptan numeros')
    }
    if (request.body.genero && request.body.genero.toUpperCase() !== 'MASCULINO' && request.body.genero.toUpperCase() !== 'FEMENINO') {
      throw new ValidatorException('El genero es invalido')
    }
    Schema.weights.findOne({_id: request.params.id}).then((row) => {
      if (!row) {
        throw new ValidatorException('No existe el peso!')
      }
      if (request.body.max && request.body.min && ((request.body.max - request.body.min) <= 0 || request.body.min === 0 || request.body.max === 0)) {
        throw new ValidatorException('El rango de pesos es invalido')
      }
      if (request.body.max && ((request.body.max - row.min) <= 0 || row.min === 0 || request.body.max === 0)) {
        throw new ValidatorException('El rango máximo no es valido con el minimo existente!')
      }
      if (request.body.max && ((row.max - request.body.min) <= 0 || request.body.min === 0 || row.max === 0)) {
        throw new ValidatorException('El rango mínimo no es valido con el máximo existente!')
      }
      for (var i = 0, keys = Object.keys(row.schema.obj), n = keys.length; i < n; i++) {
        if (request.body[keys[i]]) {
          row[keys[i]] = request.body[keys[i]]
        }
      }
      return row.save()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {delete} /:id Eliminar una peso estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  weightURI.delete('/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('EL id no es valido')
    }
    Schema.weights.findOne().then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el peso!')
      }
      return data.remove()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  app.use('/v1/physic/static/weight', weightURI)

  var heightURI = express.Router()
  /*
  * Ruta /v1/physic/static/height

  * @api {post} / Crear altura estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  heightURI.post('/', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isFloat()(request.body.age) || !Validator.isFloat()(request.body.min) || !Validator.isFloat()(request.body.max)) {
      throw new ValidatorException('Solo se aceptan numeros')
    }
    if ((request.body.max - request.body.min) <= 0 || request.body.min === 0 || request.body.max === 0) {
      throw new ValidatorException('El rango de pesos es invalido')
    }
    if (request.body.genero.toUpperCase() !== 'MASCULINO' && request.body.genero.toUpperCase() !== 'FEMENINO') {
      throw new ValidatorException('El genero es invalido')
    }
    var genero = request.body.genero.toUpperCase()
    let Heights = Schema.heights
    Heights.findOne({age: request.body.age, genero: genero}).then((data) => {
      if (data) {
        throw new ValidatorException('Ya existe un registro similar!')
      }
      let height = new Heights({
        age: request.body.age,
        min: request.body.min,
        max: request.body.max,
        genero: genero
      })
      return height.save()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} / Obtener todas los altura estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  heightURI.get('/', function (request, response, next) {
    Schema.heights.find().then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} /:name Obtener un altura estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  heightURI.get('/:id', function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('EL id no es valido')
    }
    Schema.heights.findOne({_id: request.params.id}).then((data) => {
      if (!data) {
        throw new ValidatorException('No existe la altura!')
      }
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /:id Editar altura estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  heightURI.put('/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('EL id no es valido')
    }
    if ((request.body.age && !Validator.isFloat()(request.body.age)) || (request.body.min && !Validator.isFloat()(request.body.min)) || (request.body.max && !Validator.isFloat()(request.body.max))) {
      throw new ValidatorException('Solo se aceptan numeros')
    }
    if (request.body.genero && request.body.genero.toUpperCase() !== 'MASCULINO' && request.body.genero.toUpperCase() !== 'FEMENINO') {
      throw new ValidatorException('El genero es invalido')
    }
    Schema.heights.findOne({_id: request.params.id}).then((row) => {
      if (request.body.max && request.body.min && ((request.body.max - request.body.min) <= 0 || request.body.min === 0 || request.body.max === 0)) {
        throw new ValidatorException('El rango de pesos es invalido')
      }
      if (request.body.max && ((request.body.max - row.min) <= 0 || row.min === 0 || request.body.max === 0)) {
        throw new ValidatorException('El rango máximo no es valido con el minimo existente!')
      }
      if (request.body.max && ((row.max - request.body.min) <= 0 || request.body.min === 0 || row.max === 0)) {
        throw new ValidatorException('El rango mínimo no es valido con el máximo existente!')
      }
      for (var i in row.schema.obj) {
        if (request.body[i]) {
          row[i] = request.body[i]
        }
      }
      return row.save()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {delete} /:id Eliminar una altura estatico
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  heightURI.delete('/:id', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    if (!Validator.isMongoId()(request.params.id)) {
      throw new ValidatorException('EL id no es valido')
    }
    Schema.heights.findOne({_id: request.params.id}).then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el registro')
      }
      return data.remove()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  app.use('/v1/physic/static/height', heightURI)

  /*
  * Ruta /v1/users
  * @var UsersURI object enrutador para agrupar metodos
  */
  var UsersURI = express.Router()

  /*
  * @api {post} / Crear usuario docente
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  UsersURI.post('/', function (request, response, next) {
    var user = new User(Schema.User)
    var people = new People(Schema.Peoples)
    request.body.dni = request.body.dni.toUpperCase()
    if (!Validator.matches(/^[VE][0-9]{6,9}$/)(request.body.dni)) {
      throw new ValidatorException('Solo se aceptan documentos de identidad')
    }
    if (Validator.isNull()(request.body.username)) {
      throw new ValidatorException('Es necesario un nombre de usuario valido')
    }
    if (!Validator.isEmail()(request.body.email)) {
      throw new ValidatorException('Es necesario un email valido')
    }
    if (!Validator.isLength(5, 14)(request.body.password)) {
      throw new ValidatorException('Es necesario una contraseña de por lo menos 5 caracteres')
    }
    var fields = {
      username: request.body.username,
      email: request.body.email,
      password: request.body.password,
      people: null
    }
    people.find({dni: request.body.dni}).then((data) => {
      fields.people = data
      return user.add(fields)
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      if (error.code === '100') {
        error.setMessage('No existe en el registro del personal')
      }
      next(error)
    })
  })

  /*
  * @api {get} / Obtener todos los  usuario docente
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  UsersURI.get('/', Auth.isAdmin.bind(Schema), function (request, response, next) {
    Schema.User.find().then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {get} /:id Obtener un usuario docente
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  UsersURI.get('/:id', Auth.isAdmin.bind(Schema), function (request, response, next) {
    Schema.User.findOne({_id: request.params.id}).then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el usuario!')
      }
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /root/:id Editar permiso usuario docente
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  UsersURI.put('/root/:id', Auth.isAdmin.bind(Schema), function (request, response, next) {
    Schema.User.findOne({_id: request.params.id}).then((data) => {
      data.isAdmin = (request.body.isAdmin && request.body.isAdmin === 'true')
      return data.save();
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {put} /:id Editar usuario docente
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  UsersURI.put('/:id', Auth.isUser.bind(Schema), function (request, response, next) {
    if (request.body.isAdmin) {
      throw new ValidatorException('no puede realizar un cambio de administración')
    }
    if (request.body.dni) {
      throw new ValidatorException('No puede alterar un documento de identidad')
    }
    if (request.body.username && !Validator.isAlphanumeric()(request.body.username)) {
      throw new ValidatorException('Es necesario un nombre de usuario valido')
    }
    if (request.body.email && !Validator.isEmail()(request.body.email)) {
      throw new ValidatorException('Es necesario un email valido')
    }
    if (request.body.password && !Validator.isLength(5, 14)(request.body.password)) {
      throw new ValidatorException('Es necesario una contraseña de por lo menos 5 caracteres')
    }
    if (request.body.password) {
      const base64 = require('base-64')
      request.body.password = base64.encode(request.body.password)
    }
    Schema.User.findOne({_id: request.params.id}).then((row) => {
      if (!row) {
        throw new VoidException('No existe el registro')
      }
      if (request.user.isAdmin !== true && row._id.toString() !== request.user._id.toString()) {
        throw new ValidatorException('No tiene permisos para editar este registro')
      }
      for (var i in row.schema.obj) {
        if (i !== 'dni') {
          row[i] = request.body[i]
        }
      }
      return row.save()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * @api {delete} /:id Eliminar un usuario docente
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
  UsersURI.delete('/:id', Auth.isAdmin.bind(Schema), function (request, response, next) {
    Schema.User.findOne({_id: request.params.id}).then((data) => {
      if (!data) {
        throw new ValidatorException('No existe el usuario')
      }
      return data.remove()
    }).then((data) => {
      response.send(data)
    }).catch((error) => {
      next(error)
    })
  })

  app.use('/v1/users', UsersURI)

  /*
  * @api {get} /v1/auth/ Obtener todos los representantes
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  * Authorization: Basic base64(username:pass)
  */
  app.post('/v1/auth', function (request, response, next) {
    const base64 = require('base-64')
    var username = request.body.username
    var pass = base64.encode(request.body.password)
    Schema.User.findOne({
      $or: [
        {username: username},
        {email: username}
      ]
    }).then((data) => {
      if (!data || pass !== data.password) {
        throw new UserException('usuario invalido!')
      }
      request.user = request.remoteUser = data
      next()
    }).catch((error) => {
      next(error)
    })
  }, function (request, response, next) {
    var user = new Token(Schema.Sessions)
    var address = request.connection.address() || request.socket.address()
    var navigator = request.headers['user-agent']
    user.add(request.user, address.address, navigator).then((token) => {
      response.send(token)
    }).catch((error) => {
      next(error)
    })
  })

  /*
  * Ruta /v1/teachers
  * @var PeopleURI object enrutador para agrupar metodos
  */
  var PeopleURI = express.Router()

  /*
  * @api {post} / Crear profesor
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  * @var people<SubPeople> objeto CRUD
  * @var people2<People> objeto CRUD
  */
  PeopleURI.post('/', Auth.isAdmin.bind(Schema),
  function (request, response, next) {
    var people = new SubPeople(Schema.Teachers)
    var people2 = new People(Schema.Peoples)
    if (!Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)) {
      throw new ValidatorException('Solo se aceptan documentos de identidad')
    }
    if (Validator.matches(/[0-9]/)(request.body.name)) {
      throw new ValidatorException('Solo se aceptan nombres validos')
    }
    if (!Validator.matches(/^[0-9]{2}\-[0-9]{2}-[0-9]{4}$/)(request.body.birthdate)) {
      throw new ValidatorException('La fecha de nacimiento no es valida')
    }
    if (request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)) {
      throw new ValidatorException('El telefono no tiene un formato valido')
    }
    if (Validator.isNull()(request.body.genero)) {
      throw new ValidatorException('Es necesario un genero')
    }
    if (request.body.genero.toUpperCase() !== 'MASCULINO' && request.body.genero.toUpperCase() !== 'FEMENINO') {
      throw new ValidatorException('El genero es invalido')
    }
    request.body.dni = request.body.dni.toUpperCase()
    Schema.Peoples.findOne({dni: request.body.dni}).then((row) => {
      if(row){
        row.mode.forEach((row2) => {
          if(row2 == "TEACHER"){
            throw new ValidatorException("Ya existe como docente!");
          }
        });
        row.mode.push("TEACHER");
        row.name = request.body.name;
        row.tel = request.body.tel;
        row.genero = request.body.genero.toUpperCase();
        return row.save();
      }else{
        var add = new Schema.Peoples({
          name: request.body.name,
          dni: request.body.dni,
          tel: request.body.tel,
          birthdate: request.body.birthdate,
          genero: request.body.genero,
          mode: ["TEACHER"]
        });
        return add.save();
      }
    }).then((data) => {
      var promises = [];
      for(var i=0, n=data.mode.length; i<n; i++){
        var row = data.mode[i];
        if(row == "TEACHER"){
          continue
        }
        var p1 = Promise.all([
          data,
          Schema.Representatives.findOne({"data.dni": data.dni})
        ]).then((rows) => {
          rows[1].data = rows[0];
          return rows[1].save();
        });
        promises.push(p1);
      }
      promises.push(people.add({
        interprete: (request.body.interprete !== undefined),
        data: data
      }));
      return Promise.all(promises);
    }).then((data) => {
      var body = data[data.length-1];
      response.send(body)
    }).catch((error) => {
      next(error)
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
		Schema.Teachers.find().then(function(data){
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
     var field = {
       'data.dni': request.params.id
     }
    if (Validator.isMongoId()(request.params.id)) {
      field = {
        '_id': request.params.id
      }
    }
		Schema.Teachers.findOne(field).then(function(data){
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
		if (request.body.birthdate && !Validator.matches(/^[0-9]{2}\-[0-9]{2}-[0-9]{4}$/)(request.body.birthdate)) {
			throw new ValidatorException('La fecha de nacimiento no es valida')
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var people,teacher;
		Schema.Teachers.findOne({_id:request.params.id}).then(function(data){
			teacher=data;
			if(!data){
				throw new VoidException("No existe un registro de este tipo");
			}
			return Schema.Peoples.findOne({_id:teacher.data._id})
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
		Promise.all([Schema.Teachers.findOne({_id:request.params.id}),Schema.Grades.findOne({_id:request.params.grade})]).then(function(data){
			if (!data[0]){
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
		var people=new SubPeople(Schema.Teachers);
		var people2=new People(Schema.Peoples);
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
		var people=new SubPeople(Schema.Students);
		var people2=new People(Schema.Peoples);
		var grade=new Grade(Schema.Grades);
		if(!Validator.isMongoId()(request.body.parent)){
			throw new ValidatorException("Es necesario el representante");
		}
		if(Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(!Validator.matches(/^[0-9]{2}\-[0-9]{2}-[0-9]{4}$/)(request.body.birthdate)){
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
		Schema.Representatives.findOne({_id:request.body.parent}).then(function(data){
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
		Schema.Students.find().populate("activities").then(function(data){
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
		Schema.Students.findOne({ _id: request.params.id })
		.populate("activities.objetive")
		.populate("activities.activity")
		.then(function (data) {
			if (!data) {
				throw new ValidatorException("No existe el alumno!");
			}
			response.send(data);
		}).catch(function (error) {
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
		Schema.Students.find({"grade._id":request.params.id}).populate("activities").then(function(data){
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
		var people=new SubPeople(Schema.Students);
		var people2=new People(Schema.Peoples);
		var grade=new Grade(Schema.Grades);
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido");
		}
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(request.body.birthdate && !Validator.matches(/^[0-9]{2}\-[0-9]{2}-[0-9]{4}$/)(request.body.birthdate)){
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
				return Schema.Students.findOne({_id:request.params.id});
			});
		}else{
			p1=Schema.Students.findOne({_id:request.params.id});
		}
		p1=p1.then(function(data){
			student=data;
			if(gradeData){
				student.grade=gradeData;
			}
			return Schema.Peoples.findOne({"dni":student.data.dni});
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
		var people=new SubPeople(Schema.Students);
		var people2=new People(Schema.Peoples);
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
		Schema.Students.findOne({_id:request.params.id}).then(function(data){
			data.discapacityLevel=140-H;
			return data.save();
		}).then(function(data){
			Events.emit("history-students",`Se ha evaluado la prueba de audición con una perdida de  ${data.discapacityLevel} dB`,data._id);
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
		var people=new SubPeople(Schema.Students);
		var people2=new People(Schema.Peoples);
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
		Schema.Students.findOne({_id:request.params.id}).then(function(data){
			var now = Date.now();
			var dates = data.data.birthdate.split("-");
			var last = Date.UTC(dates[2], dates[1], dates[0]);
			var age = Math.round((now - last) / 31536e+6);
			var element = Schema.physic({
				weight:request.body.weight,
				height:request.body.height,
				age:age,
				imc: (request.body.weight / Math.pow(request.body.height, 2)) * 10e+3
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
		var people=new SubPeople(Schema.Students);
		var people2=new People(Schema.Peoples);

		if(!Validator.isMongoId()(request.params.id)|| !Validator.isMongoId()(request.params.activity)){
			throw new ValidatorException("El id es invalido");
		}
		Promise.all([Schema.Students.findOne({_id:request.params.id}),Schema.Activities.findOne({_id:request.params.activity})]).then(function(data){
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
  /*
	* @api {put} /:id Editar alumno
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	* @var people2<People>	objeto CRUD
	*/
	StudentsURI.put("/:id/activity/:activity/objetive/:objetive/complete",
  function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)|| !Validator.isMongoId()(request.params.activity) || !Validator.isMongoId()(request.params.objetive)){
			throw new ValidatorException("El id es invalido");
		}

		Schema.Activities.findOne({_id:request.params.activity})
		.populate("objetives")
		.then((activity) => {
      if(!activity){
        throw new ValidatorException("No existe la actividad");
      }
      for(var i=0, n=activity.objetives.length; i<n; i++){
        if(activity.objetives[i]._id.toString() === request.params.objetive){
          return Promise.all([activity.objetives[i], Schema.Students.findOne({
            "_id": request.params.id
          }), activity]);
        }
      }
      throw new ValidatorException("No existe el objetivo!");
    }).then((rows) => {
      if(!rows[1]){
        throw new ValidatorException("No existe el alumno!");
			}
			var _isCompleted = (request.body.completed && request.body.completed == "true");
      var objetive = new Schema.ActivitiesMaked({
        activity: rows[2]._id,
        objetive: rows[0]._id,
        description: request.body.description,
				isAdd: _isCompleted,
				exp: (_isCompleted) ? rows[0].exp : 0
      });
			rows[1].activities.push(objetive);
			rows[1].exp += objetive.exp;
      var add = true;
      for(var i=0, n=rows[1].objetives.length; i<n;i++){
        if(rows[1].objetives[i].objetive._id.toString() === objetive.objetive.toString()) {
          add = false;
          rows[1].objetives[i].completed += (objetive.isAdd == true) ? 1 : -1
          Events.emit('history-students',
            `El alumno ha reforzado el objetivo "${rows[0].name}" como un conocimiento previo`, rows[1]._id);
          break;
        }
      }
      if(add){
        var objetiveMaked = new Schema.ObjetiveMaked({
          objetive: rows[0]
        })
        rows[1].objetives.push(objetiveMaked);
        Events.emit('history-students',
          `El alumno ha adquirido el objetivo "${rows[0].name}" como un conocimiento previo`, rows[1]._id);
      }
      if(objetive.isAdd){
        Events.emit('history-students',
          `El alumno ha completado el objetivo ${rows[0].name}`, rows[1]._id);
      }else{
        Events.emit('history-students',
        `El alumno ha fallado el objetivo ${rows[0].name}`, rows[1]._id);
      }
      return rows[1].save();
    }).then((data) =>{
			response.send(data);
		}).catch((error) => {
			next(error);
		});
	});

	StudentsURI.delete("/:id/physic/:del",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id) || !Validator.isMongoId()(request.params.del)){
			throw new ValidatorException("El id es invalido!");
		}
		Schema.Students.findOne({_id:request.params.id}).then(function(data){
			for (i in data.physics){
				if(data.physics[i]._id.toString()==request.params.del.toString()){
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
		var people=new SubPeople(Schema.Students);
		var test=new CRUD(Schema.TestInteligence);
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
				var test=new Schema.testIntStudent({
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
		var people=new SubPeople(Schema.Representatives);
		var people3=new SubPeople(Schema.Students);
		var people2=new People(Schema.Peoples);
		if(!Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if(!Validator.matches(/^[0-9]{2}\-[0-9]{2}\-[0-9]{4}$/)(request.body.birthdate)){
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
    request.body.dni = request.body.dni.toUpperCase()
    Schema.Peoples.findOne({dni: request.body.dni}).then((row) => {
      if(row){
        row.mode.forEach((row2) => {
          if(row2 == "PARENT"){
            throw new ValidatorException("Ya existe como representante!");
          }
        });
        row.mode.push("PARENT");
        row.name = request.body.name;
        row.tel = request.body.tel;
        row.genero = request.body.genero.toUpperCase();
        return row.save();
      }else{
        var add = new Schema.Peoples({
          name: request.body.name,
          dni: request.body.dni,
          tel: request.body.tel,
          birthdate: request.body.birthdate,
          genero: request.body.genero,
          mode: ["PARENT"]
        });
        return add.save();
      }
    }).then((data) => {
      var promises = [];
      for(var i=0, n=data.mode.length; i<n; i++){
        var row = data.mode[i];
        if(row == "PARENT"){
          continue
        }
        var p1 = Promise.all([
          data,
          Schema.Teachers.findOne({"data.dni": data.dni})
        ]).then((rows) => {
          rows[1].data = rows[0];
          return rows[1].save();
        });
        promises.push(p1);
      }
      promises.push(people.add({
        data: data
      }));
      return Promise.all(promises);
    }).then((data) => {
      var body = data[data.length-1];
      response.send(body)
    }).catch((error) => {
      next(error)
    });
		/*var fields={
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
		});*/
	});
	/*
	* @api {get} / Obtener todos los representantes
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var people<SubPeople>	objeto CRUD
	*/
	ReferencesToURI.get("/",function(request, response,next) {
		Schema.Representatives.find().populate('students').then(function(data){
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
		Schema.Representatives.findOne({_id:request.params.id}).populate('students').then(function(data){
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
		var people=new SubPeople(Schema.Representatives);
		var people2=new People(Schema.Peoples);
		var grade=new Grade(Schema.Grades);
		if(request.body.dni && !Validator.matches(/^[VE][0-9]{6,15}/i)(request.body.dni)){
			throw new ValidatorException("Solo se aceptan documentos de identidad");
		}
		if(request.body.name && Validator.matches(/[0-9]/)(request.body.name)){
			throw new ValidatorException("Solo se aceptan nombres validos");
		}
		if (request.body.birthdate && !Validator.matches(/[0-9]{2}\-[0-9]{2}\-[0-9]{4}/)(request.body.birthdate)){
			throw new ValidatorException("La fecha de nacimiento no es valida");
		}
		if(request.body.tel && !Validator.matches(/^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/)(request.body.tel)){
			throw new ValidatorException("El telefono no tiene un formato valido");
		}
		if(request.body.genero && request.body.genero.toUpperCase()!="MASCULINO" && request.body.genero.toUpperCase()!="FEMENINO" ){
			throw new ValidatorException("El genero es invalido");
		}
		var people, represent;
		Schema.Representatives.findOne({_id:request.params.id}).then(function(data){
			represent=data;
			return Schema.Peoples.findOne({_id:represent.data._id});
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
		var people=new SubPeople(Schema.Representatives);
		var people2=new People(Schema.Peoples);
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
	inferenURI.post("/type",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.events);
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
		var category=new CategoryCoginitions(Schema.events);
		Schema.events.find().then(function(data){
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
		Schema.events.findOne({_id:request.params.id}).then(function(data){
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
	inferenURI.put("/type/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.events);
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
	inferenURI.delete("/type/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.events);
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
	inferenURI.post("/:event/inferences",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var domain=new CategoryCoginitions(Schema.events);
		if(Validator.isNull()(request.body.premise)){
			throw new ValidatorException("Solo se aceptan textos categoricos");
		}
		if(Validator.isNull()(request.body.consecuent)){
			throw new ValidatorException("Es necesario una consecuencia");
		}
		if(!Validator.isMongoId()(request.params.event)){
			throw new ValidatorException("Solo se aceptan dominios validos");
		}
		Schema.events.findOne({ _id: ObjectId(request.params.event) })
		.then(function(row){
			if(!row){
				throw new ValidatorException("El evento no existe!");
			}
			var exp=new RegExp(`([xp-t][0-9]+)`,'g');
			var var_dump={};
			var matchs=request.body.premise.match(exp);
			var matchs=request.body.premise.match(exp);
			if(!matchs || !request.body.consecuent.match(exp)){
				throw new ValidatorException("las inferencias deben poseer variables de inferencias desde p hasta t o x");
			}
			var inference= new Schema.inferences({
				premise:request.body.premise,
				consecuent:request.body.consecuent
			});
			matchs.forEach((row)=>{
				var_dump[row]=[1,2,3];
			});
			Events.ChainGetAll([inference],var_dump);
			row.premises.push(inference);
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
		Schema.events.findOne({name:request.params.event.toUpperCase()}).then(function(row){
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
		Schema.events.findOne({name:request.params.event.toUpperCase()}).then(function(data){
			if(!data){
				throw new ValidatorException("No existe el evento!");
			}
			for (var i=0,n=data.premises.length;i<n;i++){
				if(data.premises[i]._id.toString()==request.params.id.toString()){
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
	inferenURI.put("/:event/inferences/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.events);
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
	inferenURI.delete("/:event/inferences/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if (!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("No es valido el Id!");
		}
		var category=new CategoryCoginitions(Schema.events);
		category.update({name:request.params.event.toUpperCase()},function(obj){
			for(var i = 0, n = obj.premises.length; i<n; i++){
				console.log(obj.premises[i]._id, request.params.id);
				if(obj.premises[i]._id.toString()==request.params.id.toString()){
					obj.premises[i].remove();
					return obj;
				}
			}
			throw new ValidatorException("No existe el registro!");
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
	activityURI.post("/:course",Auth.isTeacherOrNot.bind(Schema),function(request, response,next) {
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
		request.body.expire = new Date(request.body.expire.replace(" ","T"))
		if (request.body.expire.getTime() <= Date.now()){
			throw new ValidatorException("La fecha ya expir");
		}
		var dni=request.user.people.dni;
		if(request.body.teacher && request.user.isAdmin==true){
			dni=request.body.teacher;
		}
		request.body.name = request.body.name.toUpperCase()
		request.body.description = request.body.description.toUpperCase()
		var _words = WORDS.SeparatorWords(request.body.description);
		var _concepts = [], _pending = [],
			_radios = [], _morpholy = [],
			_conditions = [], _cognitions = [],
			_domains = [], _levels = [], _concepts_keywords = [],
			_verbs = [], _actions = [], _keywords = [];
		var _queryWords = _words.map((row) => {
			return Schema.words.findOne({ key: row });
		});
		Promise.all(_queryWords)
			.then((words) => {
				_pending = WORDS.getPending(words, _pending, _words);
				if (_pending.length > 0) {
					Events.emit("new-words", _pending);
				}
				_morpholy = words;
				var querys = words.map((row) => {
					if (!row) {
						return null;
					}
					return Schema.Hiperonimo.findOne({
						$or: [
							{ "hiponimos.key": row.key },
							{ "hiponimos.words": row.key }
						]
					});
				});
				var _ranges = words.map((row) => {
					if (!row) {
						return null;
					}
					var exp = new RegExp(row.key, "ig");
					return Schema.LearningObjetive.find({ description: { $regex: exp } }).count();
				});
				return Promise.all([querys, Promise.all(_ranges), Schema.LearningObjetive.count()]);
			})
			.then((rows) => {
				var _ranges = rows[1], _count = rows[2], _MAX = 0;
				_concepts = rows[0];
				for (var i = 0, n = _ranges.length; i < n; i++) {
					_radios[i] = 0;
					if (!_ranges[i]) {
						continue;
					}
					if (_count > 0) {
						_radios[i] = _ranges[i] / _count;
					}
					_MAX = Math.max(_MAX, _radios[i]);
				}
				return Promise.all([
					Schema.events.findOne({ name: 'KEYWORDS-SEARCH' }),
					Schema.events.findOne({ name: 'KEYWORDS-IS' }),
					_MAX
				]);
			})
			.then((rows) => {
				var event = rows[0], eventTaxon = rows[1], _MAX = rows[2];
				if (!event) {
					/**
					 * q1: Es palabra clave
					 * q2: Es observable
					 * q3: Es Acción
					 * q10: Errores
					 */
					event = new Schema.events({
						name: 'KEYWORDS-SEARCH',
						objects: {
							p1: 'Palabra', // Palabra
							p2: 'radio texto', // Cantidad de repeticiones por objetivos
							p3: 'información lexica', // conceptos gramaticales
							p4: 'información semantica', // conceptos semanticos
						},
						premises: []
					});
					event.save();
				}
				if (!eventTaxon) {
					/**
					 * q4: condiciones
					 * q5: funciones cognitivas
					 * q6: dominios
					 * q7: niveles
					 * q8: errores
					 * q9: puntos de experiencia estimados
					*/
					eventTaxon = new Schema.events({
						name: 'KEYWORDS-IS',
						objects: {
							p1: 'Palabra', // Palabra
							p2: 'radio texto', // Cantidad de repeticiones por objetivos
							p3: 'información lexica', // conceptos gramaticales
							p4: 'información semantica', // conceptos semanticos
							q1: "ES PALABRA CLAVE",
							q2: "ES OBSERVABLE",
							q3: "ES ACCIÓN"
						},
						premises: []
					});
					eventTaxon.save();
				}
				var _verbs = [], actions = [];
				for (var i = 0, n = _morpholy.length; i < n; i++) {
					if (!_morpholy[i]) {
						continue;
					}
					var _taxons = _morpholy[i].concepts.map((row) => {
						return `${row.key}|${row.value}`;
					});
					var _value = {
						p1: _words[i],
						p2: _radios[i],
						p3: _taxons,
						p4: _concepts[i].concept
					};
					var _consecuents = Events.ChainGetAll(event.premises, _value);
					for (var k = 0, u = _consecuents.length; k < u; k++) {
						var _consecuent = _consecuents[k];
						if (_consecuent.q10) {
							throw new MachineError(_consecuent.q10);
						}
						if (_consecuent.q1) {
							_keywords.push(_morpholy[i].key);
							_concepts_keywords.push(_morpholy[i]);
							_value.q1 = _consecuent.q1;
						}
						if (_consecuent.q2) {
							_verbs.push({
								word: _morpholy[i],
								concept: _concepts[i],
								range: _radios[i]
							});
							_value.q2 = _consecuent.q2;
						}
						if (_consecuent.q3) {
							_actions.push({
								word: _morpholy[i],
								concept: _concepts[i],
								range: _radios[i]
							});
							_value.q3 = _consecuent.q3;
						}
					}
					/*
					//_value = Object.assign(_value, _consecuent);
					var _consecuents = Events.ChainGetAll(eventTaxon.premises, _value);
					for (var j = 0, u = _consecuents.length; j < u; j++) {
						if (_consecuents[j].q4 && _consecuents[j].h >= 0.5) {
							_conditions.push(_consecuents[j].q4);
						}
						if (_consecuents[j].q5 && _consecuents[j].h >= 0.5) {
							_cognitions.push(_consecuents[j].q5);
						}
						if (_consecuents[j].q6 && _consecuents[j].h >= 0.5) {
							_domains.push({
								_id: _consecuents[j].q6,
								h: _consecuents[j].h
							});
						}
						if (_consecuents[j].q7 && _consecuents[j].h >= 0.5) {
							_levels.push({
								_id: _consecuents[j].q7,
								h: _consecuents[j].h
							});
						}
						if (_consecuents[j].q8 && _consecuents[j].h >= 0.5) {
							throw new MachineError(_consecuents[j].q8);
						}
						if (_consecuents[j].q9 && _consecuents[j].h >= 0.5) {
							request.body.exp = parseFloat(_consecuents[j].q9);
						}
					}*/
				}
				return Promise.all([
					Schema.Courses.findOne({ name: request.params.course.toUpperCase() }),
					Schema.Teachers.findOne({ "data.dni": dni.toUpperCase() })
				]);
			})
			.then((data) => {
				if (!data[0]) {
					throw new ValidatorException("No existe la materia!");
				}
				if (!data[1]) {
					throw new ValidatorException("No existe el docente!");
				}
				if (!data[1].grade) {
					throw new ValidatorException("No posee asignado un grado!");
				}
				var activity = new Schema.Activities({
					name:request.body.name,
					description:request.body.description,
					objetives: _cognitions,
					isCompleted:false,
					dateExpire: request.body.expire,
					teacher: data[1]._id,
					student: [],
					grade:data[1].grade,
					course:data[0],
					words: _keywords
				});
				return activity.save();
			})
			.then((data) => {
				var _body = data.toJSON();
				_body.pending = _pending;
				response.send(_body);
			})
			.catch((error) => {
				next(error)
			})
	});
	/*
  * @api {get} / Obtener todos los objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
	activityURI.get('/:id/students',
		function (request, response, next) {
			if (!Validator.isMongoId()(request.params.id)) {
				throw new ValidatorException('El id es invalido!')
			}
			var _rules, _RULES_ADD, _morphology, _activity;
			Promise.all([
				Schema.events.findOne({ name: 'KEYWORDS-IS' }),
				Schema.Activities.findOne({ _id: ObjectId(request.params.id) }),
				Schema.events.findOne({ name: 'KEYWORDS-SEARCH' })
			]).
				then((rows) => {
					_rules = rows[2];
					_RULES_ADD = rows[0];
					if (!_rules) {
						/**
						 * q1: Es palabra clave
						 * q2: Es observable
						 * q3: Es Acción
						*/
						_rules = new Schema.events({
							name: 'KEYWORDS-SEARCH',
							objects: {
								p1: 'Palabra', // Palabra
								p2: 'radio texto', // Cantidad de repeticiones por objetivos
								p3: 'información lexica', // conceptos gramaticales
								p4: 'información semantica', // conceptos semanticos
							},
							premises: []
						});
						_rules.save();
					}
					if (!_RULES_ADD) {
						/**
						 * q4: condiciones
						 * q5: funciones cognitivas
						 * q6: dominios
						 * q7: niveles
						 * q8: errores
						 * q9: puntos de experiencia estimados
						*/
						_RULES_ADD = new Schema.events({
							name: 'KEYWORDS-IS',
							objects: {
								p1: 'Palabra', // Palabra
								p2: 'radio texto', // Cantidad de repeticiones por objetivos
								p3: 'información lexica', // conceptos gramaticales
								p4: 'información semantica', // conceptos semanticos
								q1: "ES PALABRA CLAVE",
								q2: "ES OBSERVABLE",
								q3: "ES ACCIÓN"
							},
							premises: []
						});
						_RULES_ADD.save();
					}
					if (!rows[1]) {
						throw new ValidatorException('No existe el objetivo!')
					}
					_activity = rows[1];
					if (!_activity.words) {
						_activity.words = [];
					}
					var _premises = _activity.words.map((row) => {
						if (!row) {
							return null;
						}
						return Schema.words.findOne({ key: row });
					});
					return Promise.all(_premises);
				})
				.then((words) => {
					_morphology = words;
					var querys = words.map((row) => {
						if (!row) {
							return null;
						}
						return Schema.Hiperonimo.findOne({
							$or: [
								{ "hiponimos.key": row.key },
								{ "hiponimos.words": row.key }
							]
						});
					});
					return Promise.all(querys);
				})
				.then((hiperonimos) => {
					var _queryCognition = hiperonimos.map((row) => {
						if (!row) {
							return null;
						}
						return { words: row._id };
					});
					_queryCognition = _queryCognition.filter((row) => {
						return !!row;
					})
					if (_queryCognition.length == 0) {
						return [];
					}
					return Schema.Cognitions.find({ $or: _queryCognition });
				})
				.then((rows) => {
					var _queryObjetives = rows.map((cognition) => {
						return { cognitions: cognition._id };
					});
					var _query1 = [];
					if (_queryObjetives.length > 0) {
						_query1 = Schema.LearningObjetive.find({ $or: _queryObjetives });
					}
					return _query1;
				})
				.then((rows) => {
					var _query1 = [];
					var _queryObjetives = rows.map((cognition) => {
						return {
							$and: [
								{"activities.objetive": cognition._id},
								{ "activities.isAdd": false}
							]
						};
					});
					if (_queryObjetives.length > 0) {
						_query1 = Schema.Students.find({
							$and: [
								{"grade._id": _activity.grade._id},
								{$or: _queryObjetives}
							]
						});
					}
					return Promise.all([
						_query1,
						Schema.Students.find({
							"grade._id": _activity.grade._id
						})
					]);
				})
				.then((rows) => {
					var _body = [];
					for (var i = 0, n = rows.length; i < n; i++) {
						_body[i] = rows[i].filter((row) => {
							for (var i = 0, n = _activity.students.length; i < n; i++) {
								if (_activity.students[i].toString() == row._id.toString()) {
									return false;
								}
							}
							return true;
						});
					}
					_body[1] = _body[1].filter((row) => {
						for (var i = 0, n = _body[0].length; i < n; i++) {
							if (_body[0][i]._id.toString() == row._id.toString()) {
								return false;
							}
						}
						return true;
					});
					response.send(_body);
				}).catch((error) => {
					console.log(error);
					next(error)
				})
		})
	/*
  * @api {get} / Obtener todos los objetivo de aprendizaje
  * @params request peticiones del cliente
  * @params response respuesta del servidor
  * @params next middleware dispara la proxima funcion
  */
	activityURI.get('/:id/objetives',
		function (request, response, next) {
			if (!Validator.isMongoId()(request.params.id)) {
				throw new ValidatorException('El id es invalido!')
			}
			var _rules, _RULES_ADD, _morphology, _activity;
			Promise.all([
				Schema.events.findOne({ name: 'KEYWORDS-IS' }),
				Schema.Activities.findOne({ _id: ObjectId(request.params.id) }),
				Schema.events.findOne({ name: 'KEYWORDS-SEARCH' })
			]).
				then((rows) => {
					_rules = rows[2];
					_RULES_ADD = rows[0];
					if (!_rules) {
						/**
						 * q1: Es palabra clave
						 * q2: Es observable
						 * q3: Es Acción
						*/
						_rules = new Schema.events({
							name: 'KEYWORDS-SEARCH',
							objects: {
								p1: 'Palabra', // Palabra
								p2: 'radio texto', // Cantidad de repeticiones por objetivos
								p3: 'información lexica', // conceptos gramaticales
								p4: 'información semantica', // conceptos semanticos
							},
							premises: []
						});
						_rules.save();
					}
					if (!_RULES_ADD) {
						/**
						 * q4: condiciones
						 * q5: funciones cognitivas
						 * q6: dominios
						 * q7: niveles
						 * q8: errores
						 * q9: puntos de experiencia estimados
						*/
						_RULES_ADD = new Schema.events({
							name: 'KEYWORDS-IS',
							objects: {
								p1: 'Palabra', // Palabra
								p2: 'radio texto', // Cantidad de repeticiones por objetivos
								p3: 'información lexica', // conceptos gramaticales
								p4: 'información semantica', // conceptos semanticos
								q1: "ES PALABRA CLAVE",
								q2: "ES OBSERVABLE",
								q3: "ES ACCIÓN"
							},
							premises: []
						});
						_RULES_ADD.save();
					}
					if (!rows[1]) {
						throw new ValidatorException('No existe el objetivo!')
					}
					_activity = rows[1];
					if (!_activity.words){
						_activity.words = [];
					}
					var _premises = _activity.words.map((row) => {
						if (!row) {
							return null;
						}
						return Schema.words.findOne({ key: row });
					});
					return Promise.all(_premises);
				})
				.then((words) => {
					_morphology = words;
					var querys = words.map((row) => {
						if (!row) {
							return null;
						}
						return Schema.Hiperonimo.findOne({
							$or: [
								{ "hiponimos.key": row.key },
								{ "hiponimos.words": row.key }
							]
						});
					});
					return Promise.all(querys);
				})
				.then((hiperonimos) => {
					var _queryCognition = hiperonimos.map((row) => {
						if (!row) {
							return null;
						}
						return { words: row._id };
					});
					_queryCognition = _queryCognition.filter((row) => {
						return !!row;
					})
					if (_queryCognition.length == 0){
						return [];
					}
					return Schema.Cognitions.find({ $or: _queryCognition });
				})
				.then((rows) => {
					var _queryObjetives = rows.map((cognition) => {
						return { cognitions: cognition._id};
					});
					var _query1 = [];
					if (_queryObjetives.length > 0){
						_query1 = Schema.LearningObjetive.find({ $or: _queryObjetives});
					}
					return Promise.all([
						_query1,
						Schema.LearningObjetive.find()
					]);
				})
				.then((rows) => {
					var _body = [];
					for(var i = 0, n = rows.length; i<n; i++){
						_body[i] = rows[i].filter((row) => {
							for (var i = 0, n = _activity.objetives.length; i < n; i++) {
								if (_activity.objetives[i].toString() == row._id.toString()) {
									return false;
								}
							}
							return true;
						});
					}
					_body[1] = _body[1].filter((row) => {
						for (var i = 0, n = _body[0].length; i < n; i++) {
							if (_body[0][i]._id.toString() == row._id.toString()) {
								return false;
							}
						}
						return true;
					});
					response.send(_body);
				}).catch((error) => {
					next(error)
				})
		})
	/*
	* @api {post} /:domain/activities/:type Crear Categoria cognitiva
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	activityURI.put("/:id/objetives/:objetive",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var dm;
		if(!Validator.isMongoId()(request.params.objetive)){
			throw new ValidatorException("El objetivo no es un id valido!");
		}
		Promise.all([Schema.LearningObjetive.findOne({_id:request.params.objetive}),Schema.Activities.findOne({_id:request.params.id}).populate("students")]).then((data)=>{
			if(!data[0]){
				throw new ValidatorException("No existe el objetivo de aprendizaje!");
			}
			if(!data[1]){
				throw new ValidatorException("No existe la actividad!");
			}
			if (data[1].isCompleted == true) {
				throw new ValidatorException("La actividad ya ha sido completada");
			}
			data[1].objetives.forEach((row)=>{
					if(row._id.toString()==data[0]._id.toString()){
						throw new ValidatorException("El objetivo ya existe en la actividad!");
					}
			});
			data[1].objetives.push(data[0]);
			data[1].exp += data[0].exp;
			return data[1].save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	/*
	* @api {post} /:id/objetives asigna un grupo de funciones cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	activityURI.put("/:id/objetives",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if(!Validator.isJSON()(request.body.data)){
			throw new ValidatorException("no es valido el contenido!")
		}
    var data = JSON.parse(request.body.data).map((row) => {
      if (!Validator.isMongoId()(row)) {
        throw new ValidatorException("No es valido el id!")
      }
      return Schema.LearningObjetive.findOne({_id: row})
    })
    Promise.all(data).then((objetives) => {
      return Promise.all([objetives, Schema.Activities.findOne({_id:request.params.id}).populate("students")])
    }).then((data)=>{
			if(!data[0]){
				throw new ValidatorException("No existenlos objetivo de aprendizaje!");
			}
			if(!data[1]){
				throw new ValidatorException("No existe la actividad!");
			}
			if(data[1].isCompleted == true){
				throw new ValidatorException("La actividad ya ha sido completada");
			}
      data[0].forEach((objetive) => {
        data[1].objetives.forEach((row)=>{
          if(row.toString() === objetive._id.toString()){
            throw new ValidatorException("El objetivo ya existe en la actividad!");
          }
        });
				data[1].objetives.push(objetive);
				data[1].exp += objetive.exp;
      })
			return data[1].save();
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
	activityURI.put("/:id/student/:student",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("La actividad no es un id valido!");
		}
		if(!Validator.isMongoId()(request.params.student)){
			throw new ValidatorException("El estudiante no es un id valido!");
		}
		Promise.all([Schema.Activities.findOne({_id:request.params.id}),Schema.Students.findOne({_id:request.params.student})]).then((data)=>{
			if(!data[0]){
				throw new ValidatorException("No existe la actividad!");
			}
			if(!data[1]){
				throw new ValidatorException("No existe el estudiante!");
			}
			if(data[1].grade.name!=data[0].grade.name){
				throw new ValidatorException("No coinciden los grados!");
			}
			if (data[0].isCompleted == true) {
				throw new ValidatorException("La actividad ya ha sido completada");
			}
			data[0].students.forEach((row)=>{
					if(row._id.toString()==data[1]._id.toString()){
						throw new ValidatorException("El estudiante ya existe!");
					}
			});
			data[0].students.push(data[1]);
			Events.emit("history-students",`ha sido asignada la actividad ${data[0].name}`,data[1]._id);
			return data[0].save();
		}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
  /*
	* @api {post} /:id/student asigna un grupo de alumnos
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions> objeto CRUD
	*/
	activityURI.put("/:id/student",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if(!Validator.isJSON()(request.body.data)){
			throw new ValidatorException("no es valido el contenido!")
		}
    var data = JSON.parse(request.body.data).map((row) => {
      if (!Validator.isMongoId()(row)) {
        throw new ValidatorException("No es valido el id!")
      }
      return Schema.Students.findOne({_id: row})
    })
    Promise.all(data).then((students) => {
      return Promise.all([students, Schema.Activities.findOne({_id:request.params.id}).populate("students")])
    }).then((data)=>{
			if(!data[0]){
				throw new ValidatorException("No existenlos objetivo de aprendizaje!");
			}
			if(!data[1]){
				throw new ValidatorException("No existe la actividad!");
			}
			if (data[1].isCompleted == true) {
				throw new ValidatorException("La actividad ya ha sido completada");
			}
      data[0].forEach((student) => {
        data[1].students.forEach((row)=>{
          if(row._id.toString() === student._id.toString()){
            throw new ValidatorException("El alumno ya existe en la actividad!");
          }
        });
        data[1].students.push(student);
      })
			return data[1].save();
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
	activityURI.delete("/:id/student/:student",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("La actividad no es un id valido!");
		}
		if(!Validator.isMongoId()(request.params.student)){
			throw new ValidatorException("El estudiante no es un id valido!");
		}
		Schema.Activities.findOne({_id:request.params.id}).then((data)=>{
			if(!data){
				throw new ValidatorException("No existe la actividad!");
			}
			if (data.isCompleted == true) {
				throw new ValidatorException("La actividad ya ha sido completada");
			}
			for(var i=0,n=data.students.length;i<n;i++){
				var row=data.students[i];
				if(row.toString()==request.params.student){
					data.students.splice(i,1);
					Events.emit("history-students",`removida activida ${data.name}`,row);
					return data.save();
				}
			}
			throw new ValidatorException("No existe el estudiante!");
		}).then((data)=>{
			return data.populate("students");
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
	activityURI.delete("/:id/objetives/:objetive",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var dm;
		if(!Validator.isMongoId()(request.params.objetive)){
			throw new ValidatorException("El objetivo no es un id valido!");
		}
		Schema.Activities.findOne({_id:request.params.id})
		.populate("objetives")
		.then((data)=>{
			if(!data){
				throw new ValidatorException("No existe la actividad!");
			}
			if (data.isCompleted == true) {
				throw new ValidatorException("La actividad ya ha sido completada");
			}
      for (var i = 0, n=data.objetives.length; i < n; i++) {
        if(data.objetives[i]._id.toString()==request.params.objetive){
					data.exp -= data.objetives[i].exp;
					data.objetives.splice(i, 1);
          return data.save();
        }
      }
			throw new ValidatorException("No existe el objetivo!");
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
		Schema.Activities.find({"grade.name":request.params.grade.toUpperCase(),"course.name":request.params.course.toUpperCase(),teacher:request.params.teacher}).then(function(rows){
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});
	activityURI.get("/teacher",function(request, response,next) {
    Schema.Teachers.findOne({'data.dni': request.user.people.dni})
    .then((row) => {
      if (!row) {
        throw new ValidatorException('No existe el docente!')
      }
      return Schema.Activities.find({teacher: row._id})
    }).then(function(rows){
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
		Schema.Activities.find({"grade.name":request.params.grade.toUpperCase(),teacher:request.params.teacher}).then(function(rows){
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
		Schema.Activities.findOne({_id:request.params.id})
		.populate("students")
		.populate("objetives")
		.then(function(rows){
			if(!rows){
				throw new ValidatorException("No existe la actividad!");
			}
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});

	/*
	* @api {put} /:id/completed Dar por completada una actividad
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	activityURI.put("/:id/completed",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		Schema.Activities.findOne({_id:request.params.id }).populate("students").then(function(obj){
			if(!obj){
				throw new ValidatorException("No existe el registro");
			}
      obj.isCompleted = true;
      obj.dateCompleted = Date.now();
			return obj.save();
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
	activityURI.delete("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if(!Validator.isMongoId()(request.params.id)){
			throw new ValidatorException("El id es invalido!");
		}
		Schema.Activities.findOne({_id:request.params.id }).then(function(obj){
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

	var helpsURI= express.Router();
	/*
	* @api {get} / Obtener todas las categorias cognitivas
	* @params request peticiones del cliente
	* @params response respuesta del servidor
	* @params next middleware dispara la proxima funcion
	* @var category<CategoryCoginitions>	objeto CRUD
	*/
	helpsURI.get("/activity/objetives/:activity/",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.activity)){
			throw new ValidatorException("No es valido el id");
		}
		Schema.Activities.findOne({_id:request.params.activity}).then(function(row){
			if(!row){
				throw new ValidatorException("No existe la actividad!");
			}
			return Promise.all([Events.get("ACTIVITY-HELP-OBJETIVES"),row]);
		}).then((data)=>{
			if(!data[0]){
				throw new ValidatorException("No tengo inferencia sobre esta acción. Solicite a un gestor del conocimiento añadir un nuevo conocimiento!");
			}
			var event=data[0];
			var objetives=data[1].objetives.map((row)=>{
				return row.name + " | " + row.description;
			});
			var querys=Events.ChainGetAll(event.premises,{
				p1:data[1].name,
				p2:data[1].description,
				p3:data[1].grade.name,
				p4:data[1].course.name,
				p5:objetives
			});
			if(querys.length==0){
				return querys;
			}
			querys=querys.map((row)=>{
				return {_id:row.q1};
			});
			querys=querys.filter((row)=>{
				for(var i=0,n=data[1].objetives.length;i<n;i++){
					if(data[1].objetives[i]._id.toString()==row._id.toString()){
						return false;
					}
				}
				return true;
			});
			return Schema.LearningObjetive.find({$or:querys});
		}).then((rows)=>{
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
	helpsURI.get("/objetives/:objetive/cognitions",function(request, response,next) {
		if(!Validator.isMongoId()(request.params.objetive)){
			throw new ValidatorException("No es valido el id");
		}
		Schema.LearningObjetive.findOne({_id:request.params.objetive}).then(function(row){
			if(!row){
				throw new ValidatorException("No existe el objetivo!");
			}
			return Promise.all([Events.get("OBJETIVES-HELP-COGNITIONS"),row,Schema.domainsLearning.findOne({_id:row.domain._id})]);
		}).then((data)=>{
			if(!data[2]){
				throw new ValidatorException("No existe el dominio del objetivo!");
			}
			if(!data[0]){
				var helpEvent=new Schema.events({
					name:"OBJETIVES-HELP-COGNITIONS",
					objects:{
						p1:"data[1].name",
						p2:"data[1].description",
						p3:"data[1].level.level",
						p4:"data[1].domain.name",
						p5:"cognitions",
						p6:"addcognitions"
					}
				});
				helpEvent.save();
				return [];
			}
			var event=data[0];
			var cognitions=data[2].cognitions.map((row)=>{
				return row.name;
			});
			var addcognitions=data[1].cognitions.map((row)=>{
				return row.name;
			});
			var querys=Events.ChainGetAll(event.premises,{
				p1:data[1].name,
				p2:data[1].description,
				p3:data[1].level.level,
				p4:data[1].domain.name,
				p5:cognitions,
				p6:addcognitions
			});
			if(querys.length==0){
				return querys;
			}
			querys=querys.map((row)=>{
				return data[2].cognitions.filter((row2)=>{
					return row2._id.toString()==row.q1;
				})[0];
			});
			querys=querys.filter((row)=>{
				for(var i=0,n=data[1].cognitions.length;i<n;i++){
					if(row._id.toString()==data[1].cognitions[i]._id.toString()){
						return false;
					}
				}
				return true;
			});
			return querys;
		}).then((rows)=>{
			response.send(rows);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/helps",helpsURI);


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
		var people=new SubPeople(Schema.Representatives);
		var people3=new SubPeople(Schema.Students);
		var people2=new People(Schema.Peoples);
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
		var morphem=new CRUD(Schema.morphem_type);
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
		var morphem=new CRUD(Schema.morphem_type);
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
		var morphem=new CRUD(Schema.morphem_type);
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
		var morphem=new CRUD(Schema.morphem_type);
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
		var people=new SubPeople(Schema.Representatives);
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
		var people=new SubPeople(Schema.Representatives);
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
		var people=new SubPeople(Schema.Representatives);
		var people2=new People(Schema.Peoples);
		var grade=new Grade(Schema.Grades);
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
		Schema.Representatives.findOne({_id:request.params.id}).then(function(data){
			represent=data;
			return Schema.Peoples.findOne({_id:represent.data._id});
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
		var people=new SubPeople(Schema.Representatives);
		var people2=new People(Schema.Peoples);
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
	HabilitiesURI.post("/",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var hability=new Habilities(Schema.Habilities);
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
		var hability=new Habilities(Schema.Habilities);
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
		var hability=new Habilities(Schema.Habilities);
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
	HabilitiesURI.put("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var hability=new Habilities(Schema.Habilities);
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
	HabilitiesURI.delete("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var grade=new Habilities(Schema.Habilities);
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
		var grade= new Activities(Schema.Activities);
		var people= new SubPeople(Schema.Teachers);
		var course= new Course(Schema.Courses);
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
			TeacherCreate:new Schema.Teachers(request.people),
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
		var activity=new Activities(Schema.Activities);
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
		var activity= new Activities(Schema.Activities);
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
		var activity= new Activities(Schema.Activities);
		var people= new SubPeople(Schema.Teachers);
		var course= new Course(Schema.Courses);

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
		var activity=new Activities(Schema.Activities);
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
		var conflict=new Habilities(Schema.ConflictCognitions);
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
		var conflict=new Habilities(Schema.ConflictCognitions);
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
		var conflict=new Habilities(Schema.ConflictCognitions);
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
		var conflict=new Habilities(Schema.ConflictCognitions);
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
		var conflict=new Habilities(Schema.ConflictCognitions);
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
	periodURI.post("/",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var period=new Period(Schema.PeriodSchools);
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
		var period=new Period(Schema.PeriodSchools);
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
		var period=new Period(Schema.PeriodSchools);
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
	periodURI.put("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var period=new Period(Schema.PeriodSchools);
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
	periodURI.delete("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var period=new Period(Schema.PeriodSchools);
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
	categoryCognitionURI.post("/",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
	categoryCognitionURI.put("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
	categoryCognitionURI.delete("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
	categoryCognitionURI.post("/:name",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
	categoryCognitionURI.put("/:name/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
	categoryCognitionURI.delete("/:name/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var category=new CategoryCoginitions(Schema.CategoryCognitions);
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
	testParent.post("/",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var test=new CRUD(Schema.TestInteligence);
		if(Validator.isNull()(request.body.name)){
			throw new ValidatorException("Es requerido un nombre");
		}
		if(request.body.range && !Validator.isJSON(request.body.range)){
			throw new ValidatorException("Los datos de rangos no son validos");
		}
		var fields={
			name:request.body.name.toString(),
			range:(request.body.range) ? new Schema.RangeInteligence(JSON.parse(request.body.range)) : null
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
	testParent.get("/",Auth.isTeacherOrNot.bind(Schema),function(request, response,next) {
		var test=new CRUD(Schema.TestInteligence);
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
	testParent.get("/:id",Auth.isTeacherOrNot.bind(Schema),function(request, response,next) {
		var test=new CRUD(Schema.TestInteligence);
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
	testParent.put("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		if(!Validator.isJSON(request.body.range)){
			throw new ValidatorException("Los datos de rangos no son validos");
		}
		var test=new CRUD(Schema.TestInteligence);
		test.update({_id:request.params.id},function(data){
			data.range= new Schema.RangeInteligence(JSON.parse(request.body.range));
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
	testParent.delete("/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var test=new CRUD(Schema.TestInteligence);
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
	testParent.post("/:name",Auth.isAdmin.bind(Schema),function(request, response,next) {
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
		var test=new CRUD(Schema.TestInteligence);
		test.update({name:request.params.name.toUpperCase()},function(data){
			var serie=new Schema.SerieInteligence({
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
	testParent.delete("/:name/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var test=new CRUD(Schema.TestInteligence);
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
	testParent.post("/:name/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var test=new CRUD(Schema.TestInteligence);
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
					var item=new Schema.ItemsInteligence({
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
	testParent.delete("/:name/:id/:item",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var test=new CRUD(Schema.TestInteligence);
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
	testParent.post("/inteligence/range",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var user=new CRUD(Schema.groupsInteligence);
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
	inteligenceURI.post("/range",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var user=new CRUD(Schema.groupsInteligence);
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
	inteligenceURI.get("/range",Auth.isTeacherOrNot.bind(Schema),function(request, response,next) {
		var user=new CRUD(Schema.groupsInteligence);
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
	inteligenceURI.get("/range/:id",Auth.isTeacherOrNot.bind(Schema),function(request, response,next) {
		var user=new CRUD(Schema.groupsInteligence);
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
	inteligenceURI.delete("/range/:id",Auth.isAdmin.bind(Schema),function(request, response,next) {
		var user=new CRUD(Schema.groupsInteligence);
		user.remove({_id:request.params.id}).then(function(data){
			response.send(data);
		}).catch(function(error){
			next(error);
		});
	});
	app.use("/v1/inteligence",inteligenceURI);*/
}
