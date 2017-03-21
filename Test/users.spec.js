var utils=require("./utils.js");
var faker = require('faker');

describe("Test route static height",function(){
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

	it("GET /v1/users/",function(done){
		utils.runApp("GET","/v1/users/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].username).toBe('root');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/users",function(done){
		var p1=self.db.schema.Peoples({
			dni:'V12345679',
			name:"user teacher",
			birthdate:"1970-01-01",
			mode:"TEACHER"
		});
		p1.save().then(function(data){
			return utils.runApp("POST","/v1/users/?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
				form:{
					username:"usuario",
					password:"12345",
					email:"nombre@correo.com",
					dni:"V12345679"
				}
			});
		}).then(function(response){
			expect(response.username).toBe("usuario");
			expect(response.email).toBe("nombre@correo.com");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/users/:id",function(done){
		utils.runApp("GET","/v1/users/"+user.user+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId).then(function(response){
			expect(response.username).toBe('root');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/physic/static/height/:id",function(done){
		utils.runApp("PUT","/v1/users/"+user.user+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId,{
			form:{
				username:"coco",
				email:"hola@correo.com"
			}
		}).then(function(response){
			expect(response.username).toBe("coco");
			expect(response.email).toBe("hola@correo.com");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/physic/static/height/:id",function(done){
		find=new  self.db.schema.heights({
			age:Math.round(Math.random()*90)+1,
			min:Math.round(Math.random()*90)+1,
			max:Math.round(Math.random()*90)+1			
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/users/"+user.user+"?PublicKeyId="+user.publicKeyId+"&PrivateKeyId="+user.privateKeyId);
		}).then(function(response){
			expect(String(response._id)).toBe(String(user.user));
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})