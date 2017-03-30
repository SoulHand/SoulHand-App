var utils=require("./utils.js");
var faker = require('faker');

describe("Test route teachers",function(){
	var self=this,user;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		var p1=utils.insertSession(self.db);
		self.people=self.db.schema.Peoples({
			dni:"V12345679",
			name:"people",
			birthdate:"1992-03-15",
			mode:"TEACHER"
		});
		self.teacher=self.db.schema.Teachers({
			data:self.people,
			interprete:false
		})
		Promise.all([p1,self.people.save(),self.teacher.save()]).then(function(data){
			user=data[0];
			done();
		}).catch(function(error){
			done();
		})
	})

	it("GET /v1/people/teachers/",function(done){
		utils.runApp("GET","/v1/people/teachers/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].data.dni).toBe("V12345679");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("POST /v1/people/teachers/",function(done){
		utils.runApp("POST","/v1/people/teachers/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				dni:"V12345675",
				name:"people",
				birthdate:"1992-03-15"
			}
		}).then(function(response){
			expect(response.data.dni).toBe("V12345675");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/people/teachers/:id",function(done){
		utils.runApp("GET","/v1/people/teachers/"+self.teacher._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(response.data.dni).toBe('V12345679');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/people/teachers/:id",function(done){
		utils.runApp("PUT","/v1/people/teachers/"+self.teacher._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
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
	it("DELETE /v1/people/teachers/:id",function(done){
		utils.runApp("DEL","/v1/people/teachers/"+self.teacher._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(String(response.data.dni)).toBe(String('V12345679'));
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})