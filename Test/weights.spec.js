var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		find=new  self.db.schema.weights({
			height:Math.round(Math.random()*90)+1,
			min:Math.round(Math.random()*90)+1,
			max:Math.round(Math.random()*90)+1,
			genero:"FEMENINO"
		});
		Promise.all([utils.insertSession(self.db), find.save()]).then(function(data){	
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	})
	
	it("GET /v1/physic/static/weight/",function(done){
		utils.runApp("GET",`/v1/physic/static/weight/`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].height).toBe(find.height);
			done();
		}).catch(function(error){
			console.log(error);
			expect(error).toBeNull();
			done();
		});
	});
	
	it("GET /v1/physic/static/weight/:id",function(done){
		utils.runApp("GET",`/v1/physic/static/weight/${find._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.height).toBe(find.height);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	
	it("GET /v1/physic/static/weight/:id (failed)",function(done){
		utils.runApp("GET",`/v1/physic/static/weight/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});	
	});
	it("PUT /v1/physic/static/weight/:id",function(done){
		utils.runApp("PUT",`/v1/physic/static/weight/${find._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				height:12
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.height).toBe(12);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("POST /v1/physic/static/weight/",function(done){
		utils.runApp("POST",`/v1/physic/static/weight/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				height:8,
				min:10,
				max:12.32,
				genero:"masculino"
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.height).toBe(8);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/physic/static/weight/:id",function(done){
		utils.runApp("DEL",`/v1/physic/static/weight/${find._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(find._id.toString());
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
});