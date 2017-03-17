var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge activities",function(){
	var self=this,user;
	var find2,find3,find;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		var p1=utils.insertSession(self.db)
		find=new  self.db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[self.db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find2=new self.db.schema.Courses({
			name:faker.name.findName()				
		});
		find3=new self.db.schema.Activities({
			name:faker.name.findName(),
			description:"hola",
			course:find2,
			domain:find._id
		});
		Promise.all([p1, find.save(),find2.save(),find3.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			done();
		})
	})

	
	it("GET /:domain/activities/:course",function(done){		
		utils.runApp("GET","/v1/knowedge/"+find._id+"/activities/"+find2.name).then(function(response){
			expect(response[0].name).toBe(find3.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("POST /:domain/activities/:course",function(done){
		var name=faker.name.findName();
		utils.runApp("POST","/v1/knowedge/"+find.name+"/activities/"+find2.name+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				name:name,
				description:"hola"
			}
		}).then(function(response){
			expect(response.name).toBe(name.toUpperCase());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("GET /:domain/activities/:course/:id",function(done){
		utils.runApp("GET","/v1/knowedge/"+find._id+"/activities/"+find2.name+"/"+find3._id).then(function(response){
			expect(response.name).toBe(find3.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});

	it("PUT /:domain/activities/:course/:id",function(done){
		utils.runApp("PUT","/v1/knowedge/"+find._id+"/activities/"+find2.name+"/"+find3._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				name:"hola"
			}
		}).then(function(response){
			expect(response.name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /:domain/activities/:course/:id",function(done){
		utils.runApp("DEL","/v1/knowedge/"+find._id+"/activities/"+find2.name+"/"+find3._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(response.name).toBe(find3.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})