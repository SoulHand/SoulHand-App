var InsertException=require("../src/BackEnd/SoulHand/Exceptions/InsertException.js");
var VoidException=require("../src/BackEnd/SoulHand/Exceptions/VoidException.js");
var db=require("./prepare.js");
var faker = require('faker');
var Grade=require("../src/BackEnd/SoulHand/CRUD.js");
describe("CRUD clase Table Grades",function(){
	var grade=new Grade(db.Grades),find;
	afterEach(function(done){
		db.Grades.find().then(function(data){
			for (i in data){
				data[i].remove();
			}
			done();
		})
	})
	beforeEach(function(done){
		find=new  db.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(){
			done();			
		})
	})
	it("Create Element Grade",function(done){
		var input={
			name:faker.name.findName()
		};
		grade.add(input,input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Create duplicated Element Grade",function(done){
		var input={
			name:find.name
		};
		grade.add(input,input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});
	it("Delete Element Grade",function(done){
		grade.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			console.log(error.toString());
			//throw error;
			//fail(error.toString());
		});
	});
	it("Delete not exist Element Grade",function(done){
		var id="58a1c1a27093140970ad3751";
		grade.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("Update Element Grade",function(done){
		var update=faker.name.findName();
		grade.update({_id:find._id},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Update not exist Element Grade",function(done){
		var id="58a1c1a27093140970ad3751";
		var update=faker.name.findName();
		grade.update({_id:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			console.log(error.toString())
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Grade",function(done){
		var input={
			name:faker.name.findName()
		};
		grade.add(input,input).then(function(data){
			return grade.find({_id:data._id});
		}).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("find not exist Element Grade",function(done){
		var input={
			name:faker.name.findName()
		};
		grade.add(input,input).then(function(data){
			return grade.find({_id:data._id});
		}).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		});
	});
});