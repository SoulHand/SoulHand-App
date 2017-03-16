var InsertException=require("../src/BackEnd/SoulHand/Exceptions/InsertException.js");
var VoidException=require("../src/BackEnd/SoulHand/Exceptions/VoidException.js");
var utils=require("./utils.js");
var faker = require('faker');

// Test CRUD from Table Cognitions
describe("CRUD clase Table Cognitions",function(){
	var cognition, find, category;
	var Cognition=require("../src/BackEnd/SoulHand/Cognitions.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		cognition=new Cognition(db.schema.Cognitions);
		find=new  db.schema.Cognitions({
			name:faker.name.findName(),
		});
		find.save().then(function(){
			done();			
		})
	})
	it("Create Element cognition",function(done){
		var input={
			name:faker.name.findName(),
			category:category
		};
		cognition.add({name:input.name},input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Create duplicated Element cognition",function(done){
		var input={
			name:find.name,
			category:category
		};
		cognition.add({name:input.name},input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});
	/*it("Create not exist category Element cognition",function(done){
		var input={
			name:faker.name.findName(),
			category:{
				_id:"58a1c1a27093140960ad3751",
				name:faker.name.findName(),
			}
		};
		cognition.add({$or:[{name:input.name},{"category._id":input.category._id}]},input).then(function(data){
			console.log(data);
		}).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});*/
	it("Delete Element cognition",function(done){
		cognition.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element cognition",function(done){
		var id="58a1c1a27093140970ad3751";
		cognition.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("Update Element cognition",function(done){
		var update=faker.name.findName();
		cognition.update({_id:find._id},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Update not exist Element cognition",function(done){
		var id="58a1c1a27093140970ad3751";
		var update=faker.name.findName();
		cognition.update({_id:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element cognition",function(done){		
		cognition.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		});
	});
	it("find not exist Element cognition",function(done){
		var id="58a1c1a27093140970ad3751";		
		cognition.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
});