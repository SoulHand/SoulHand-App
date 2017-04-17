var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		find=new  self.db.schema.inferences({
			premise:"p1==\"hola\"",
			consecuent:"q1=\"saludo\"",
			h:0.85
		});
		category=new self.db.schema.events({
			name:faker.name.findName(),
			objects:{
				p1:"var1"
			},
			premises:[find]
		});
		Promise.all([utils.insertSession(self.db), category.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	})
	
	it("GET /v1/events/type",function(done){
		utils.runApp("GET",`/v1/events/type`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(category.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET /v1/events/type/:id",function(done){
		utils.runApp("GET",`/v1/events/type/${category._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(category.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET /v1/events/type/:id (failed)",function(done){
		utils.runApp("GET",`/v1/events/type/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("PUT /v1/events/type/:id",function(done){
		utils.runApp("PUT",`/v1/events/type/${category._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
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
	it("POST /v1/events/type/",function(done){
		utils.runApp("POST",`/v1/events/type?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"hola",
				objects:JSON.stringify(
					{
						p1:"var1.value"
					}
				)
			}
		}).then(function(response){
			response=JSON.parse(response);	
			expect(response.name).toBe("HOLA");
			expect(response.objects.length).toBe(1);
			expect(response.objects[0].p1).toBe("var1.value");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/events/type/:id",function(done){
		utils.runApp("DEL",`/v1/events/type/${category._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(category._id.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
});