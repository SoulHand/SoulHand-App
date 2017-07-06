var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.schema=utils.getDatabase();
		self.people=self.schema.Peoples({
			dni:"V12345679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"STUDENT",
			genero:"FEMENINO"
		});
		self.people2=self.schema.Peoples({
			dni:"V13145679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"TEACHER",
			genero:"FEMENINO"
		});
		self.grade=self.schema.Grades({
			name:"1ro"
		});
		self.student=self.schema.Students({
			data:self.people,
			grade:self.grade,
			discapacityLevel:0
		});
		self.teacher=self.schema.Teachers({
			data:self.people2,
			interprete:true
		});
		Promise.all([utils.insertSession(self.schema), self.grade.save(), self.people.save(),self.people2.save(),self.student.save(),self.teacher.save()]).then(function(data){
			user=data[0]
			done();
		}).catch(function(error){
			done(error);
		});
	})

	it("GET /v1/people/teachers",function(done){
		utils.runApp("GET",`/v1/people/teachers/`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].data.name).toBe(self.teacher.data.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});

	it("GET /v1/people/teachers/:id",function(done){
		utils.runApp("GET",`/v1/people/teachers/${self.teacher._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.data.name).toBe(self.teacher.data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("GET /v1/people/teachers/:id (failed)",function(done){
		utils.runApp("GET",`/v1/people/teachers/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("PUT /v1/people/teachers/:id",function(done){
		utils.runApp("PUT",`/v1/people/teachers/${self.teacher._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola"
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.data.name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/people/teachers/",function(done){
		var input={
			dni:faker.helpers.replaceSymbolWithNumber("V########"),
			name:faker.name.findName(),
			birthdate:"05-03-1994",
			tel:faker.phone.phoneNumberFormat(),
			interprete:true,
			genero:"MASCULINO"
		};
		utils.runApp("POST",`/v1/people/teachers/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:input
		}).then(function(response){
      console.log(response);
			response=JSON.parse(response);
			expect(response.data.dni).toBe(input.dni.toUpperCase());
			expect(response.data.name).toBe(input.name.toUpperCase());
			expect(response.data.tel).toBe(input.tel);
			expect(response.data.mode).toBe("TEACHER");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("DELETE /v1/people/teachers/:id",function(done){
		utils.runApp("DEL",`/v1/people/teachers/${self.teacher._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(self.teacher._id.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
});
