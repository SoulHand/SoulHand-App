var utils=require("./utils.js");
var faker = require('faker');

describe("Test route grade",function(){
	var self=this,user;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		utils.insertSession(self.db).then(function(data){
			user=data
			done();
		}).catch(function(error){
			done();
		})
	})
	
	it("GET /v1/grades/",function(done){
		find=new  self.db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/grades/");			
		}).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/grades/",function(done){
		var name=faker.name.findName().toUpperCase();
		utils.runApp("POST","/v1/grades/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				name:name
			}
		}).then(function(response){
			expect(response.name).toBe(name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/grades/:id",function(done){
		find=new  self.db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/grades/"+find._id);
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/grades/:id",function(done){
		find=new  self.db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("PUT","/v1/grades/"+find._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				name:"hola"
			}
		});
		}).then(function(response){
			expect(response.name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/grades/:id",function(done){
		find=new  self.db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/grades/"+find._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId);
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("GET /v1/grades/:id bad response",function(done){
		utils.runApp("GET","/v1/grades/58c9fac8ea59732e59361b12").then(function(response){
			expect(response.code).toBe('100');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("GET /v1/grades/:id invalid id response",function(done){
		utils.runApp("GET","/v1/grades/58c9f59732e59361b12").then(function(response){
			expect(response.code).toBe('130');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})