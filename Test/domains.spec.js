var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		find=new  self.db.schema.Cognitions({
			name:faker.name.findName(),
			description:"mensaje"
		});
		category=new self.db.schema.domainsLearning({
			name:faker.name.findName(),
			description:"mensaje",
			cognitions:[find]
		});
		Promise.all([utils.insertSession(self.db), category.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	})
	
	it("GET /v1/learning/domain",function(done){
		utils.runApp("GET",`/v1/learning/domain/`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(category.name);
			done();
		}).catch(function(error){
			console.log(error);
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET /v1/knowedge/:domain/cognitions/:id",function(done){
		utils.runApp("GET",`/v1/learning/domain/${category._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(category.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET /v1/knowedge/:domain/cognitions/:id (failed)",function(done){
		utils.runApp("GET",`/v1/learning/domain/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("PUT /v1/knowedge/:domain/cognitions/:id",function(done){
		utils.runApp("PUT",`/v1/learning/domain/${category._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola"
			}
		}).then(function(response){
			response=JSON.parse(response);			
			expect(response.name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("POST /v1/knowedge/:domain/cognitions/",function(done){
		utils.runApp("POST",`/v1/learning/domain/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola",
				description:"proceso de hola"
			}
		}).then(function(response){
			response=JSON.parse(response);	
			expect(response.name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/knowedge/:domain/cognitions/:id",function(done){
		utils.runApp("DEL",`/v1/learning/domain/${category._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(category._id.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
});