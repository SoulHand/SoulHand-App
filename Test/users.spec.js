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
			mode:"TEACHER"
		});
		self.grade=self.db.schema.Grades({
			name:"1ro"
		});
		self.student=self.db.schema.Students({
			data:self.people,
			grade:self.grade,
			discapacityLevel:0
		});
		self.teacher=self.db.schema.Teachers({
			data:self.people2,
			interprete:true
		});
		Promise.all([utils.insertSession(self.db),self.grade.save(), self.people.save(),self.people2.save(),self.student.save(),self.teacher.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	})
	
	it("GET /v1/users/",function(done){
		utils.runApp("GET",`/v1/users/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response[0]._id).toBe(user.user.toString());
			done();
		}).catch(function(error){
			console.log(error);
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET /v1/users/:id",function(done){
		utils.runApp("GET",`/v1/users/${user.user}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(user.user.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET /v1/users/:id (failed)",function(done){
		utils.runApp("GET",`/v1/users/00f0f2dd60e8613875e5e488?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("PUT /v1/users/:id",function(done){
		utils.runApp("PUT",`/v1/users/${user.user}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				username:"hola"
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.username).toBe("hola");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/users/root/:id",function(done){
		utils.runApp("PUT",`/v1/users/root/${user.user}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				isAdmin:false
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.isAdmin).toBe(false);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("POST /v1/users/",function(done){
		var input={
			dni:self.teacher.data.dni,
			username:faker.internet.userName(),
			email:faker.internet.exampleEmail(),
			password:"12345",
			interprete:true
		};
		utils.runApp("POST",`/v1/users/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:input
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.username).toBe(input.username);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/auth/",function(done){
		var input={
			username:"root",
			password:"12345"
		};
		utils.runApp("POST",`/v1/auth/`,{
			form:input
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.user.username).toBe(input.username);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("DELETE /v1/users/:id",function(done){
		utils.runApp("DEL",`/v1/users//${user.user}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(user.user.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
});