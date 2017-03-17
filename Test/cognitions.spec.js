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
	
	it("GET /v1/knowedge/:domain/objetives/:type",function(done){
		var find2,find3;
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return new self.db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(data){
			find2=data;
			find3=new self.db.schema.LearningObjetive({
				name:faker.name.findName(),
				description:"hola",
				type:find2,
				domain:find._id
			});
			return find3.save();
		}).then(function(){
			return utils.runApp("GET","/v1/knowedge/"+find._id+"/objetives/"+find2.name);
		}).then(function(response){
			expect(response[0].name).toBe(find3.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/knowedge/:domain/objetives/:type",function(done){
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName()			
		});
		var name=faker.name.findName().toUpperCase();
		find.save().then(function(){
			return new self.db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(vb){
			find2=vb;			
			return utils.runApp("POST","/v1/knowedge/"+find.name+"/objetives/"+find2.name+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
				form:{
					name:name,
					description:"hola"
				}
			});
		}).then(function(response){
			expect(response.name).toBe(name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/knowedge/:domain/objetives/:type/:id",function(done){
		var find2,find3;
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return new self.db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(data){
			find2=data;
			find3=new self.db.schema.LearningObjetive({
				name:faker.name.findName(),
				description:"hola",
				type:find2,
				domain:find._id
			});
			return find3.save();
		}).then(function(){
			return utils.runApp("GET","/v1/knowedge/"+find._id+"/objetives/"+find2.name+"/"+find3._id);
		}).then(function(response){
			expect(response.name).toBe(find3.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/knowedge/:domain/cognitions/:id",function(done){
		var find2,find3;
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return new self.db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(data){
			find2=data;
			find3=new self.db.schema.LearningObjetive({
				name:faker.name.findName(),
				description:"hola",
				type:find2,
				domain:find._id
			});
			return find3.save();
		}).then(function(){
			return utils.runApp("PUT","/v1/knowedge/"+find._id+"/objetives/"+find2.name+"/"+find3._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
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
	it("DELETE /v1/knowedge/:domain/cognitions/:id",function(done){
		var find2,find3;
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return new self.db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(data){
			find2=data;
			find3=new self.db.schema.LearningObjetive({
				name:faker.name.findName(),
				description:"hola",
				type:find2,
				domain:find._id
			});
			return find3.save();
		}).then(function(){
			return utils.runApp("DEL","/v1/knowedge/"+find._id+"/objetives/"+find2.name+"/"+find3._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId);
		}).then(function(response){
			expect(response.cognitions.length).toBe(0);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})