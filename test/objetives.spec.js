var utils=require("./utils.js");
var faker = require('faker');

describe("Test route knowedge cognitions",function(){
	var self=this,user,find,category;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		find=new  self.db.schema.nivelDomain({
			name:faker.name.findName(),
			level:1
		});
		self.cognition=new  self.db.schema.Cognitions({
			name:faker.name.findName(),
			description:"mensaje"
		});
		self.cognition2=new  self.db.schema.Cognitions({
			name:faker.name.findName(),
			description:"mensaje"
		});
		category=new self.db.schema.domainsLearning({
			name:faker.name.findName(),
			description:"mensaje",
			levels:[find],
			cognitions:[self.cognition,self.cognition2]
		});
		self.objetive=new self.db.schema.LearningObjetive({
			name:faker.name.findName(),
			description:"hola",
			domain:{
				_id:category._id,
				name:category.name
			},
			level:{
				_id:find._id,
				name:find.name,
				level:1
			},
			cognitions:[self.cognition2]
		});
		self.event=new self.db.schema.events({
			name:"OBJETIVES-HELP-COGNITIONS",
			objects:{
				p1:"name",
				p2:"description",
				p3:"level",
				p4:"domain.name",
				p5:"cognitions",
				p6:"addcognitions"
			},
			premises:[
				{
					premise:`(p1 =="${self.objetive.name}" && p3 == "${self.objetive.level.level}")`,
					consecuent:`q1="${self.cognition._id}"`
				}
			]
		});
		self.event2=new self.db.schema.events({
			name:"OBJETIVES-ADD",
			objects:{
				p1:"request.body.name",
				p2:"request.body.description"
			},
			premises:[
				{
					premise:`this.isContaint(p1,["alcanzar"]) || this.isContaint(p2,["Alcanzar"])`,
					consecuent:`q1="${category.name}"`
				},
				{
					premise:`this.isContaint(p1,["alcanzar","parar"]) || this.isContaint(p2,["Alcanzar","parar"])`,
					consecuent:`q2="${find.name}"`
				}
			]
		});
		Promise.all([utils.insertSession(self.db), category.save(),self.objetive.save(),self.event.save(),self.event2.save()]).then(function(data){
			user=data[0]
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		})
	});
	it("GET /v1/knowedge/:domain/objetives/:level",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/objetives/${find.name}`).then(function(response){
			response=JSON.parse(response);
			expect(response[0].name).toBe(self.objetive.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});

	it("GET /v1/knowedge/objetives/:id",function(done){
		utils.runApp("GET",`/v1/knowedge/objetives/${self.objetive._id}`).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe(self.objetive.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});

	it("GET /v1/knowedge/:domain/objetives/:level (failed)",function(done){
		utils.runApp("GET",`/v1/knowedge/${category.name}/objetives/${find.name}/00f0f2dd60e8613875e5e488`).then(function(error){
			expect(error!=undefined).toBe(true);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("POST /v1/knowedge/:domain/objetives/:level",function(done){
		utils.runApp("POST",`/v1/knowedge/${category.name}/objetives/${find.name}/?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`,{
			form:{
				name:"correr 200 mts",
				description:"Alcanzar los 200mts sin parar"
			}
		}).then(function(response){
			response=JSON.parse(response);
			expect(response.name).toBe("CORRER 200 MTS");
			expect(response.domain.name).toBe(category.name);
			expect(response.level.name).toBe(find.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("GET /v1/helps/objetives/:objetive/cognitions",function(done){
		utils.runApp("GET",`/v1/helps/objetives/${self.objetive._id}/cognitions?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response.length).toBe(1);
			expect(response[0].name).toBe(self.cognition.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("PUT /v1/knowedge/:domain/objetives/:level/:id/cognitions/:cognition",function(done){
		utils.runApp("PUT",`/v1/knowedge/${category.name}/objetives/${find.name}/${self.objetive._id}/cognitions/${self.cognition._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response.cognitions.length).toBe(2);
			expect(response.cognitions[1].name).toBe(self.cognition.name);
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("DELETE /v1/knowedge/:domain/objetives/:level",function(done){
		utils.runApp("DEL",`/v1/knowedge/${category.name}/objetives/${find.name}/${self.objetive._id}?PublicKeyId=${user.publicKeyId}&PrivateKeyId=${user.privateKeyId}`).then(function(response){
			response=JSON.parse(response);
			expect(response._id).toBe(self.objetive._id.toString());
			done();
		}).catch(function(error){
			expect(error).toBeNull();
			done();
		});
	});
})
