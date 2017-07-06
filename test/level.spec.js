var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.schema=utils.getDatabase();
		find=new  self.schema.nivelDomain({
			name:faker.name.findName(),
			level:1
		});
		category=new self.schema.domainsLearning({
			name:faker.name.findName(),
			description:"mensaje",
			levels:[find]
		});
		Promise.all([utils.insertSession(self.schema), category.save()]).then(function(data){
			user=data[0]
			done();
		}).catch(function(error){
			done(error);
		})
	});
	it("GET /v1/knowedge/:domain/level",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/level/`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(find.name);
			done();
		}).catch(function(error){
			done(error);
		});
	});

	it("GET /v1/knowedge/:domain/level/:id",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/level/${find._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			done(error);
		});
	});

	it("GET /v1/knowedge/:domain/level/:id (failed)",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/level/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("POST /v1/knowedge/:domain/level/:id",function(done){
		utils.runApp("POST",`/v1/knowedge/${category.name}/level/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola",
				level:2
			}
		}).then(function(response){
			response=JSON.parse(response);
			var cognition=response.levels.filter(function(row){
				if(row._id==find._id){
					return false;
				}
				return true;
			});
			expect(cognition[0].name).toBe("HOLA");
			done();
		}).catch(function(error){
			done(error);
		});
	});
	it("DELETE /v1/knowedge/:domain/level/:id",function(done){
		utils.runApp("DEL",`/v1/knowedge/${category.name}/level/${find._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response.cognitions.length).toBe(0);
			done();
		}).catch(function(error){
			done(error);
		});
	});
})
