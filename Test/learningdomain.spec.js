var utils=require("./utils.js");
var faker = require('faker');

describe("Test route learning domain",function(){
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
	it("GET /v1/learning/domain/",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){			
			return utils.runApp("GET","/v1/learning/domain/");
		}).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/learning/domain/",function(done){
		var name=faker.name.findName().toUpperCase();
		utils.runApp("POST","/v1/learning/domain/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
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
	it("GET /v1/learning/domain/:name",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/learning/domain/"+find.name.toLowerCase());
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/learning/domain/:id",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("PUT","/v1/learning/domain/"+find._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
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
	it("DELETE /v1/learning/domain/:id",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/learning/domain/"+find._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId);
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})