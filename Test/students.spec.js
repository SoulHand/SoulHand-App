var utils=require("./utils.js");
var faker = require('faker');

describe("Test route students",function(){
	var self=this,user;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		var p1=utils.insertSession(self.db);
		self.people=self.db.schema.Peoples({
			dni:"V12345679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"STUDENT"
		});
		self.grade=self.db.schema.Grades({
			name:"1ro"
		});
		self.teacher=self.db.schema.Students({
			data:self.people,
			grade:self.grade,
			discapacityLevel:0
		})
		Promise.all([self.grade.save(),p1,self.people.save(),self.teacher.save()]).then(function(data){
			user=data[0];
			done();
		}).catch(function(error){
			done();
		})
	})

	it("GET /v1/people/students/",function(done){
		utils.runApp("GET","/v1/people/students/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].data.dni).toBe("V12345679");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("POST /v1/people/students/",function(done){
		utils.runApp("POST","/v1/people/students/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				dni:"V12345675",
				name:"people",
				birthdate:"1992-03-15",
				grade:self.grade.name
			}
		}).then(function(response){
			expect(response.data.dni).toBe("V12345675");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("POST /v1/people/students/",function(done){
		utils.runApp("POST","/v1/people/students/"+self.teacher._id+"/physic/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				weight:50.32,
				height:100
			}
		}).then(function(response){
			expect(response.data.dni).toBe("V12345679");
			expect(response.physics.length).toBe(1);
			expect(response.physics[0].weight).toBe(50.32);
			expect(response.physics[0].height).toBe(100);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/people/students/:id",function(done){
		utils.runApp("GET","/v1/people/students/"+self.teacher._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(response.data.dni).toBe('V12345679');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/people/students/:id",function(done){
		utils.runApp("PUT","/v1/people/students/"+self.teacher._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				name:"coco"
			}
		}).then(function(response){
			expect(response.data.name).toBe("COCO");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/people/students/:id",function(done){
		utils.runApp("DEL","/v1/people/students/"+self.teacher._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(String(response.data.dni)).toBe(String('V12345679'));
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})