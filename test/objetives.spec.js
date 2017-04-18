var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		find=new  self.db.schema.nivelDomain({
			name:faker.name.findName(),
			level:1
		});
		self.cognition=new  self.db.schema.Cognitions({
			name:faker.name.findName(),
			description:"mensaje"
		});
		category=new self.db.schema.domainsLearning({
			name:faker.name.findName(),
			description:"mensaje",
			levels:[find],
			cognitions:[self.cognition]
		});
		self.objetive=new self.db.schema.LearningObjetive({
			name:faker.name.findName(),
			description:"hola",
			domain:{
				name:category.name
			},
			level:{
				name:find.name
			},
			cognitions:[]
		});
		Promise.all([utils.insertSession(self.db), category.save(),self.objetive.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	});	
	it("GET /v1/knowedge/:domain/objetives/:level",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/objetives/${find.name}`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(self.objetive.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET /v1/knowedge/:domain/objetives/:level",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/objetives/${find.name}/${self.objetive._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(self.objetive.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET /v1/knowedge/:domain/objetives/:level (failed)",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/objetives/${find.name}/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("POST /v1/knowedge/:domain/objetives/:level",function(done){
		utils.runApp("POST",`/v1/knowedge/${category.name}/objetives/${find.name}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"correr 200 mts",
				description:"Alcanzar los 200mts sin parar"
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe("CORRER 200 MTS");
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("PUT /v1/knowedge/:domain/objetives/:level/:id/cognitions/:cognition",function(done){
		utils.runApp("PUT",`/v1/knowedge/${category.name}/objetives/${find.name}/${self.objetive._id}/cognitions/${self.cognition._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response.cognitions.length).toBe(1);
			expect(response.cognitions[0].name).toBe(self.cognition.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/knowedge/:domain/objetives/:level",function(done){
		utils.runApp("DEL",`/v1/knowedge/${category.name}/objetives/${find.name}/${self.objetive._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(self.objetive._id.toString());
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
})