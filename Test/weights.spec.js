var utils=require("./utils.js");
var faker = require('faker');

describe("Test route static weight",function(){
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

	it("GET /v1/physic/static/weight",function(done){
		find=new  self.db.schema.weights({
			age:Math.round(Math.random()*90)+1,
			min:Math.round(Math.random()*90)+1,
			max:Math.round(Math.random()*90)+1			
		});
		find.save().then(function(){			
			return utils.runApp("GET","/v1/physic/static/weight/");
		}).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].age).toBe(find.age);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/physic/static/weight",function(done){
		find=new  self.db.schema.weights({
			age:Math.round(Math.random()*90)+1,
			min:Math.round(Math.random()*90)+1,
			max:Math.round(Math.random()*90)+1			
		});
		var name=10;
		find.save().then(function(){			
			return utils.runApp("POST","/v1/physic/static/weight/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
				form:{
					age:name,
					min:15,
					max:25
				}
			});
		}).then(function(response){
			expect(response.age).toBe(10);
			expect(response.min).toBe(15);
			expect(response.max).toBe(25);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/physic/static/weight/:id",function(done){
		find=new  self.db.schema.weights({
			age:Math.round(Math.random()*90)+1,
			min:Math.round(Math.random()*90)+1,
			max:Math.round(Math.random()*90)+1			
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/physic/static/weight/"+find._id);
		}).then(function(response){
			expect(response.age).toBe(find.age);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/physic/static/weight/:id",function(done){
		find=new  self.db.schema.weights({
			age:Math.round(Math.random()*90)+1,
			min:Math.round(Math.random()*90)+1,
			max:Math.round(Math.random()*90)+1			
		});
		find.save().then(function(){
			return utils.runApp("PUT","/v1/physic/static/weight/"+find._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				age:25,
				min:100,
				max:180	
			}
		});
		}).then(function(response){
			expect(response.age).toBe(25);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/physic/static/weight/:id",function(done){
		find=new  self.db.schema.weights({
			age:Math.round(Math.random()*90)+1,
			min:Math.round(Math.random()*90)+1,
			max:Math.round(Math.random()*90)+1			
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/physic/static/weight/"+find._id+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId);
		}).then(function(response){
			expect(response._id).toBe(String(find._id));
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})