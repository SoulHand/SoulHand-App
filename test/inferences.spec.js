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
	});	
	it("GET /:event/inferences/",function(done){
		utils.runApp("GET",`/v1/events/${category.name}/inferences/`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET /:event/inferences/:id",function(done){
		utils.runApp("GET",`/v1/events/${category.name}/inferences/${find._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET /:event/inferences/:id (failed)",function(done){
		utils.runApp("GET",`/v1/events/${category.name}/inferences/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("PUT /:event/inferences/:id",function(done){
		utils.runApp("PUT",`/v1/events/${category.name}/inferences/${find._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				premise:"hola"
			}
		}).then(function(response){
			response=JSON.parse(response);
			var cognition=response.premises.filter(function(row){
				if(row._id==find._id){
					return true;
				}
				return false;
			});
			expect(cognition[0].premise).toBe("hola");
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("POST /:event/inferences/:id",function(done){
		utils.runApp("POST",`/v1/events/${category.name}/inferences/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				premise:"hola",
				consecuent:"proceso de hola"
			}
		}).then(function(response){
			response=JSON.parse(response);
			var cognition=response.premises.filter(function(row){
				if(row._id==find._id){
					return false;
				}
				return true;
			});
			expect(cognition[0].premise).toBe("hola");
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("DELETE /:event/inferences/:id",function(done){
		utils.runApp("DEL",`/v1/events/${category.name}/inferences/${find._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response.premises.length).toBe(0);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
})