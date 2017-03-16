var utils=require("./utils.js");
var faker = require('faker');

describe("Test route learning",function(){
	var db,data;
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	});
	beforeEach(function(done){
		db=utils.getDatabase();
		db.schema.User({
				username:"root",
				password:'123',
				isAdmin:true,
				people:{
					dni:'1234',
					name:"ROOT USER",
					birthdate:"1970-01-01",
					mode:"TEACHER"
				}
			}).save().then(function(user){
				const uuidV4 = require('uuid/v4');
				const base64=require('base-64');
				return db.schema.Sessions({
					privateKeyId:uuidV4(),
					publicKeyId:base64.encode(user._id),
					ip:'::ffff:127.0.0.1',
					navigator:undefined,
					dateCreated:Date.now(),
					dateLastConnect:Date.now(),
					user:user._id
				}).save();
			}).then(function(val){
				data=val;
				done();				
			});
	})
	it("GET /v1/learning/",function(done){
		find=new  db.schema.typeLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/learning/");			
		}).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/learning/",function(done){
		var name=faker.name.findName().toUpperCase();
		utils.runApp("POST","/v1/learning/?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId,{
			form:{
				name:name
			}
		}).then(function(response){
			expect(response.name).toBe(name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/learning/:name",function(done){
		find=new  db.schema.typeLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/learning/"+find.name.toLowerCase());
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/learning/:id",function(done){
		find=new  db.schema.typeLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("PUT","/v1/learning/"+find._id+"?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId,{
			form:{
				name:"hola"
			}
		});
		}).then(function(response){
			expect(response.name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/learning/:id",function(done){
		find=new  db.schema.typeLearning({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/learning/"+find._id+"?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId);
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})