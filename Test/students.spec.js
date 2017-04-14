var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		self.people=self.db.schema.Peoples({
			dni:"V12345679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"STUDENT"
		});
		self.people2=self.db.schema.Peoples({
			dni:"V13145679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"PARENT"
		});
		self.grade=self.db.schema.Grades({
			name:"1ro"
		});
		self.student=self.db.schema.Students({
			data:self.people,
			grade:self.grade,
			discapacityLevel:0
		});
		self.parent=self.db.schema.Representatives({
			data:self.people2,
			students:[self.student]
		});
		Promise.all([utils.insertSession(self.db),self.grade.save(), self.people.save(),self.people2.save(),self.student.save(),self.parent.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	})
	
	it("GET /v1/people/students",function(done){
		utils.runApp("GET",`/v1/people/students/`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].data.name).toBe(self.student.data.name);
			expect(response[0].grade._id).toBe(self.grade._id.toString());
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET /v1/people/students/:id",function(done){
		utils.runApp("GET",`/v1/people/students/${self.student._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.data.name).toBe(self.student.data.name);
			expect(response.grade._id).toBe(self.grade._id.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET /v1/people/students/:id (failed)",function(done){
		utils.runApp("GET",`/v1/people/students/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("PUT /v1/people/students/:id",function(done){
		utils.runApp("PUT",`/v1/people/students/${self.student._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
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
	it("POST /v1/people/students/",function(done){
		var input={
			name:faker.name.findName(),
			birthdate:"1992-03-15",
			tel:faker.phone.phoneNumberFormat(),
			grade:self.grade._id.toString(),
			parent:self.parent._id.toString()
		};
		utils.runApp("POST",`/v1/people/students/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:input
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.data.dni.split("-")[0]).toBe(self.parent.data.dni.toUpperCase());
			expect(response.data.name).toBe(input.name.toUpperCase());
			expect(response.data.tel).toBe(input.tel);
			expect(response.data.mode).toBe("STUDENT");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("DELETE /v1/people/students/:id",function(done){
		utils.runApp("DEL",`/v1/people/students/${self.student._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(self.student._id.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
});