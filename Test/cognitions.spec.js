var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
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
	it("GET /v1/knowedge/:domain/objetives/:type",function(done){
		var find2,find3;
		find=new  db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return new db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(data){
			find2=data;
			find3=new db.schema.LearningObjetive({
				name:faker.name.findName(),
				description:"hola",
				type:find2,
				domain:find._id
			});
			return find3.save();
		}).then(function(){
			return utils.runApp("GET","/v1/knowedge/"+find._id+"/objetives/"+find2.name);
		}).then(function(response){
			expect(response[0].name).toBe(find3.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("POST /v1/knowedge/:domain/objetives/:type",function(done){
		find=new  db.schema.domainsLearning({
			name:faker.name.findName()			
		});
		var name=faker.name.findName().toUpperCase();
		find.save().then(function(){
			return new db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(vb){
			find2=vb;			
			return utils.runApp("POST","/v1/knowedge/"+find.name+"/objetives/"+find2.name+"?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId,{
				form:{
					name:name,
					description:"hola"
				}
			});
		}).then(function(response){
			expect(response.name).toBe(name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("GET /v1/knowedge/:domain/objetives/:type/:id",function(done){
		var find2,find3;
		find=new  db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return new db.schema.typeLearning({
				name:faker.name.findName()				
			}).save();
		}).then(function(data){
			find2=data;
			find3=new db.schema.LearningObjetive({
				name:faker.name.findName(),
				description:"hola",
				type:find2,
				domain:find._id
			});
			return find3.save();
		}).then(function(){
			return utils.runApp("GET","/v1/knowedge/"+find._id+"/objetives/"+find2.name+"/"+find3._id);
		}).then(function(response){
			expect(response.name).toBe(find3.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("PUT /v1/knowedge/:domain/cognitions/:id",function(done){
		find=new  db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return utils.runApp("PUT","/v1/knowedge/"+find.name+"/cognitions/"+find.cognitions[0]._id+"?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId,{
			form:{
				name:"hola"
			}
		});
		}).then(function(response){
			expect(response.cognitions[0].name).toBe("HOLA");
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
	it("DELETE /v1/knowedge/:domain/cognitions/:id",function(done){
		find=new  db.schema.domainsLearning({
			name:faker.name.findName(),
			cognitions:[db.schema.Cognitions({
				name:faker.name.findName()
			})]
		});
		find.save().then(function(){
			return utils.runApp("DEL","/v1/knowedge/"+find.name+"/cognitions/"+find.cognitions[0]._id+"?PublicKeyId="+data.publicKeyId+"&PrivateKeyId="+data.privateKeyId);
		}).then(function(response){
			expect(response.cognitions.length).toBe(0);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});	
	});
})