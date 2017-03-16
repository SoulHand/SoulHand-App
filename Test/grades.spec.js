var utils=require("./utils.js");
var faker = require('faker');

describe("Test route grade",function(){
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
	it("GET /v1/grades/",function(done){
		find=new  db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/grades/");			
		}).then(function(response){
			expect(response.length).toBe(1);
			expect(response[0].name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/grades/",function(done){
		var name=faker.name.findName().toUpperCase();
		utils.runApp("POST","/v1/grades/?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId,{
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
	it("GET /v1/grades/:id",function(done){
		find=new  db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("GET","/v1/grades/"+find._id);
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/grades/:id",function(done){
		find=new  db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/grades/"+find._id+"?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId);
		}).then(function(response){
			expect(response.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("GET /v1/grades/:id bad response",function(done){
		utils.runApp("GET","/v1/grades/58c9fac8ea59732e59361b12").then(function(response){
			expect(response.code).toBe('100');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("GET /v1/grades/:id invalid id response",function(done){
		utils.runApp("GET","/v1/grades/58c9f59732e59361b12").then(function(response){
			expect(response.code).toBe('130');
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})