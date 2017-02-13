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
	it("Delete Element Grade",function(done){
		grade.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			console.log(error.toString());
			//throw error;
			//fail(error.toString());
		});
	});
	it("Update Element Grade",function(done){
		var input={
			name:faker.name.findName()
		};
		grade.add(input,input).then(function(data){
			var update=faker.name.findName();
			grade.update({_id:data._id},function(info){
				info.name=update;
				return info;
			}).then(function(data){
				expect(update.toUpperCase()).toBe(data.name);
				done();
			});
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
});