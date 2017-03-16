var utils=require("./utils.js");
var faker = require('faker');

describe("Test route grade",function(){
	var db;
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	});
	beforeEach(function(done){
		db=utils.getDatabase();
		done();
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
})