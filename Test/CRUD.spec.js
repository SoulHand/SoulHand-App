var InsertException=require("../src/BackEnd/SoulHand/Exceptions/InsertException.js");
var VoidException=require("../src/BackEnd/SoulHand/Exceptions/VoidException.js");
var db=require("./prepare.js");
var faker = require('faker');

// Test CRUD from Table Grades
describe("CRUD clase Table Grades",function(){
	var Grade=require("../src/BackEnd/SoulHand/CRUD.js");
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
		grade.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		});
	});
	it("find not exist Element Grade",function(done){
		var id="58a1c1a27093140970ad3751";		
		grade.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
});

// Test CRUD from Table Course
describe("CRUD clase Table Courses",function(){
	var Course=require("../src/BackEnd/SoulHand/CRUD.js");
	var course=new Course(db.Courses),find;
	afterEach(function(done){
		db.Courses.find().then(function(data){
			for (i in data){
				data[i].remove();
			}
			done();
		})
	})
	beforeEach(function(done){
		find=new  db.Courses({
			name:faker.name.findName()
		});
		find.save().then(function(){
			done();			
		})
	})
	it("Create Element Course",function(done){
		var input={
			name:faker.name.findName()
		};
		course.add(input,input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Create duplicated Element Course",function(done){
		var input={
			name:find.name
		};
		course.add(input,input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});
	it("Delete Element Course",function(done){
		course.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			console.log(error.toString());
			//throw error;
			//fail(error.toString());
		});
	});
	it("Delete not exist Element Course",function(done){
		var id="58a1c1a27093140970ad3751";
		course.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("Update Element Course",function(done){
		var update=faker.name.findName();
		course.update({_id:find._id},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Update not exist Element Course",function(done){
		var id="58a1c1a27093140970ad3751";
		var update=faker.name.findName();
		course.update({_id:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			console.log(error.toString())
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Course",function(done){		
		course.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		});
	});
	it("find not exist Element Course",function(done){
		var id="58a1c1a27093140970ad3751";		
		course.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
});

// Test CRUD from Table PeriodSchools
describe("CRUD clase Table PeriodSchools",function(){
	var PeriodSchool=require("../src/BackEnd/SoulHand/CRUD.js");
	var periodSchool=new PeriodSchool(db.PeriodSchools),find;
	afterEach(function(done){
		db.PeriodSchools.find().then(function(data){
			for (i in data){
				data[i].remove();
			}
			done();
		})
	})
	beforeEach(function(done){
		find=new  db.PeriodSchools({
			name:faker.name.findName()
		});
		find.save().then(function(){
			done();			
		})
	})
	it("Create Element PeriodSchools",function(done){
		var input={
			name:faker.name.findName()
		};
		periodSchool.add(input,input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Create duplicated Element PeriodSchools",function(done){
		var input={
			name:find.name
		};
		periodSchool.add(input,input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});
	it("Delete Element PeriodSchools",function(done){
		periodSchool.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			console.log(error.toString());
			//throw error;
			//fail(error.toString());
		});
	});
	it("Delete not exist Element PeriodSchools",function(done){
		var id="58a1c1a27093140970ad3751";
		periodSchool.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("Update Element PeriodSchools",function(done){
		var update=faker.name.findName();
		periodSchool.update({_id:find._id},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Update not exist Element PeriodSchools",function(done){
		var id="58a1c1a27093140970ad3751";
		var update=faker.name.findName();
		periodSchool.update({_id:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			console.log(error.toString())
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element PeriodSchools",function(done){		
		periodSchool.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		});
	});
	it("find not exist Element PeriodSchools",function(done){
		var id="58a1c1a27093140970ad3751";		
		periodSchool.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
});

// Test CRUD from Table CategoryCognitions
describe("CRUD clase Table CategoryCognitions",function(){
	var CategoryCognition=require("../src/BackEnd/SoulHand/CRUD.js");
	var categoryCognition=new CategoryCognition(db.CategoryCognitions),find;
	afterEach(function(done){
		db.CategoryCognitions.find().then(function(data){
			for (i in data){
				data[i].remove();
			}
			done();
		})
	})
	beforeEach(function(done){
		find=new  db.CategoryCognitions({
			name:faker.name.findName()
		});
		find.save().then(function(){
			done();			
		})
	})
	it("Create Element categoryCognition",function(done){
		var input={
			name:faker.name.findName()
		};
		categoryCognition.add(input,input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Create duplicated Element categoryCognition",function(done){
		var input={
			name:find.name
		};
		categoryCognition.add(input,input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});
	it("Delete Element categoryCognition",function(done){
		categoryCognition.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			console.log(error.toString());
			//throw error;
			//fail(error.toString());
		});
	});
	it("Delete not exist Element categoryCognition",function(done){
		var id="58a1c1a27093140970ad3751";
		categoryCognition.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("Update Element categoryCognition",function(done){
		var update=faker.name.findName();
		categoryCognition.update({_id:find._id},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		});
	});
	it("Update not exist Element categoryCognition",function(done){
		var id="58a1c1a27093140970ad3751";
		var update=faker.name.findName();
		categoryCognition.update({_id:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			console.log(error.toString())
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element categoryCognition",function(done){		
		categoryCognition.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		});
	});
	it("find not exist Element categoryCognition",function(done){
		var id="58a1c1a27093140970ad3751";		
		categoryCognition.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
});