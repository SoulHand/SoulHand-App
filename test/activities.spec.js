var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		self.course=new  self.db.schema.Courses({
			name:faker.name.findName()
		});
		self.grade=new  self.db.schema.Grades({
			name:faker.name.findName()
		});
		self.people2=self.db.schema.Peoples({
			dni:"V13145679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"TEACHER",
			genero:"FEMENINO"
		});
		self.teacher=self.db.schema.Teachers({
			data:self.people2,
			interprete:true
		});
		self.activity= new self.db.schema.Activities({
			name:faker.name.findName(),
			description:"actividad",
			isCompleted:false,
		   	dateExpire:new Date(),
		   	teacher: self.teacher._id,
			student: [],
			grade:self.grade,
			course:self.course
		});
		Promise.all([utils.insertSession(self.db), self.course.save(),self.grade.save(),self.people2.save(),self.teacher.save(),self.activity.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	});	
	it("GET /v1/activities/:grade/:course/",function(done){
		utils.runApp("GET",`/v1/activities/${self.grade.name}/${self.course.name}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(self.activity.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET/v1/activities/:grade/:course/:id",function(done){
		utils.runApp("GET",`/v1/activities/${self.grade.name}/${self.course.name}/${self.activity._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(self.activity.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET/v1/activities/:grade/:course/:id (failed)",function(done){
		utils.runApp("GET",`/v1/activities/${self.grade.name}/${self.course.name}/00f0f2dd60e8613875e5e488?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("POST/v1/activities/:grade/:course/:id",function(done){
		utils.runApp("POST",`/v1/activities/${self.grade.name}/${self.course.name}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola",
				description:"descripción",
				teacher:self.teacher.data.dni,
				expire:"2016-03-15 23:04:12"
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("DELETE/v1/activities/:grade/:course/:id",function(done){
		utils.runApp("DEL",`/v1/activities/${self.grade.name}/${self.course.name}/${self.activity._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(self.activity._id.toString());
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
})