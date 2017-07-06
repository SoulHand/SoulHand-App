var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.schema = utils.getDatabase();
		self.course = new  self.schema.Courses({
			name:faker.name.findName()
		});
		self.grade = new self.schema.Grades({
			name:faker.name.findName()
		});
		self.people = new self.schema.Peoples({
			dni:"V12345679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"STUDENT",
			genero:"FEMENINO"
		});
		self.people2 = new self.schema.Peoples({
			dni:"V13145679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"TEACHER",
			genero:"FEMENINO"
		});
		self.teacher=self.schema.Teachers({
			data:self.people2,
      grade:self.grade,
			interprete:true
		});
		self.student=self.schema.Students({
			data:self.people,
			grade:self.grade,
			discapacityLevel:0,
			physics:[
				{
					height:23.43,
					weight:33,
					age:24
				}
			]
		});
		self.activity= new self.schema.Activities({
			name:faker.name.findName(),
			description:"actividad",
			isCompleted:false,
		   	dateExpire:new Date(),
		   	teacher: self.teacher._id,
			student: [],
			grade:self.grade,
			course:self.course
		});
		find=new  self.schema.nivelDomain({
			name:faker.name.findName(),
			level:1
		});
		category=new self.schema.domainsLearning({
			name:faker.name.findName(),
			description:"mensaje",
			levels:[find]
		});
		self.objetive=new self.schema.LearningObjetive({
			name:faker.name.findName(),
			description:"hola",
			domain:{
				name:category.name
			},
			level:{
				name:find.name
			},
			cognitions:[]
		});
		self.event=new self.schema.events({
			name:"ACTIVITY-HELP-OBJETIVES",
			objects:{
				p1:"name",
				p2:"description",
				p3:"grade.name",
				p4:"course.name",
				p5:"objetives"
			},
			premises:[
				{
					premise:"(this.isContaint(p1,['hola', 'actividad', 'progreso'])==true || this.isContaint(p2,['hola', 'actividad', 'progreso'])==true)",
					consecuent:`q1="${self.objetive._id}"`
				}
			]
		});
		Promise.all([utils.insertSession(self.schema), self.course.save(),self.grade.save(),self.people2.save(),self.teacher.save(),self.activity.save(),self.people.save(),self.student.save(),category.save(),self.objetive.save(),self.event.save()]).then(function(data){
			user=data[0]
			done();
		}).catch(function(error){
			done(error);
		})
	});
	it("GET /v1/activities/:grade/:teacher/:course/",function(done){
		utils.runApp("GET",`/v1/activities/${self.grade.name}/${self.teacher._id}/${self.course.name}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response = JSON.parse(response);
			expect(response[0].name).toBe(self.activity.name);
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("GET /v1/activities/:grade/:teacher/",function(done){
		utils.runApp("GET",`/v1/activities/${self.grade.name}/${self.teacher._id}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response = JSON.parse(response);
			expect(response[0].name).toBe(self.activity.name);
			done();
		}).catch(function(error){
      done(error);
		});
	});
	it("GET/v1/activities/:id",function(done){
		utils.runApp("GET",`/v1/activities/${self.activity._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response = JSON.parse(response);
			expect(response.name).toBe(self.activity.name);
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("GET /v1/helps/activity/objetives/:activity/",function(done){
		utils.runApp("GET",`/v1/helps/activity/objetives/${self.activity._id}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response = JSON.parse(response);
			expect(response.length).toBe(1);
			expect(response[0].name).toBe(self.objetive.name);
			done();
		}).catch(function(error){
			done(error);
		});
	});

	it("GET/v1/activities/:id (failed)",function(done){
		utils.runApp("GET",`/v1/activities/00f0f2dd60e8613875e5e488?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("POST /v1/activities/:grade/",function(done){
    var now = new Date(Date.now() + 100);
		utils.runApp("POST",`/v1/activities/${self.course.name}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola",
				description:"descripción",
				teacher:self.teacher.data.dni,
				expire:now.toJSON().replace("T", " ")
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe("HOLA");
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("DELETE/v1/activities/:id",function(done){
		utils.runApp("DEL",`/v1/activities/${self.activity._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(self.activity._id.toString());
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("PUT /v1/people/students/:id/activity/:activity",function(done){
		utils.runApp("PUT",`/v1/people/students/${self.student._id}/activity/${self.activity._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola"
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.students.length).toBe(1);
			expect(response.students[0]).toBe(self.student._id.toString());
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("PUT /v1/activities/:id/objetives/:objetive",function(done){
		utils.runApp("PUT",`/v1/activities/${self.activity._id}/objetives/${self.objetive._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response.objetives.length).toBe(1);
			expect(response.objetives[0]._id).toBe(self.objetive._id.toString());
			done();
		}).catch(function(error){
			done(error);
		});
	});
});
