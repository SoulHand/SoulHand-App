var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
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

	it("GET /v1/knowedge/:domain/cognitions",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){			
			return utils.runApp("GET","/v1/knowedge/"+find.name+"/cognitions/");
		}).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].name).toBe(find.cognitions[0].name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/knowedge/:domain/cognitions",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName()			
		});
		var name=faker.name.findName().toUpperCase();
		find.save().then(function(){			
			return utils.runApp("POST","/v1/knowedge/"+find.name+"/cognitions/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
				form:{
					name:name
				}
			});
		}).then(function(response){
			expect(response.name).toBe(find.name);
			expect(response.cognitions[0].name).toBe(name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/knowedge/:domain/cognitions/:name",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/knowedge/"+find.name+"/cognitions/"+find.cognitions[0].name.toLowerCase());
		}).then(function(response){
			expect(response.name).toBe(find.cognitions[0].name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/knowedge/:domain/cognitions/:id",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return utils.runApp("PUT","/v1/knowedge/"+find.name+"/cognitions/"+find.cognitions[0]._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				name:"hola"
			}
		});
		}).then(function(response){
			expect(response.cognitions[0].name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/knowedge/:domain/cognitions/:id",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/knowedge/"+find.name+"/cognitions/"+find.cognitions[0]._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId);
		}).then(function(response){
			expect(response.cognitions.length).toBe(0);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})