var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.schema = utils.getDatabase();
		find = new self.schema.Courses({
			name:faker.name.findName()
		});
		Promise.all([utils.insertSession(self.schema), find.save()]).then(function(data){
			user = data[0]
			done();
		}).catch(function(error){
			done(error);
		});
	})

	it("GET /v1/courses/",function(done){
		utils.runApp("GET",`/v1/courses/`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});

	it("GET /v1/courses/:id",function(done){
		utils.runApp("GET",`/v1/courses/${find._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("GET /v1/courses/:id (failed)",function(done){
		utils.runApp("GET",`/v1/courses/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("PUT /v1/courses/:id",function(done){
		utils.runApp("PUT",`/v1/courses/${find._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
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
	it("POST /v1/courses/",function(done){
		utils.runApp("POST",`/v1/courses/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"1ro",
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe("1RO");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("DELETE /v1/courses/:id",function(done){
		utils.runApp("DEL",`/v1/courses/${find._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(find._id.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
})
