var InsertException=require("../src/BackEnd/SoulHand/Exceptions/InsertException.js");
var VoidException=require("../src/BackEnd/SoulHand/Exceptions/VoidException.js");
var utils=require("./utils.js");
var faker = require('faker');

jasmine.DEFAULT_TIMEOUT_INTERVAL=1000;
// Test CRUD from Table Grades
describe("CRUD clase Table Grades",function(){
	var grade, find;
	var Grade=require("../src/BackEnd/SoulHand/CRUD.js");

	var self=this,user;
	afterEach(utils.dropDatabase.bind(self));
	beforeEach(function(done){
		self.db=utils.getDatabase();
		var p1=utils.insertSession(self.db)
		grade=new Grade(self.db.schema.Grades);
		find=new  self.db.schema.Grades({
			name:faker.name.findName()
		});
		find.save().then(function(data){
			user=data[1];
			done();
		}).catch(function(error){
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element Grade",function(done){
		var id="58a1c1a27093140970ad3751";
		grade.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Grade",function(done){		
		grade.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element Grade",function(done){
		var id="58a1c1a27093140970ad3751";		
		grade.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
});

// Test CRUD from Table Course
describe("CRUD clase Table Courses",function(){
	var db, course,find;
	var Course=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		course=new Course(db.schema.Courses);
		find=new  db.schema.Courses({
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Delete Element Course",function(done){
		course.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element Course",function(done){
		var id="58a1c1a27093140970ad3751";
		course.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Course",function(done){		
		course.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element Course",function(done){
		var id="58a1c1a27093140970ad3751";		
		course.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
});

// Test CRUD from Table PeriodSchools
describe("CRUD clase Table PeriodSchools",function(){
	var db, periodSchool,find;
	var PeriodSchool=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		periodSchool=new PeriodSchool(db.schema.PeriodSchools);
		find=new  db.schema.PeriodSchools({
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Delete Element PeriodSchools",function(done){
		periodSchool.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element PeriodSchools",function(done){
		var id="58a1c1a27093140970ad3751";
		periodSchool.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element PeriodSchools",function(done){		
		periodSchool.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element PeriodSchools",function(done){
		var id="58a1c1a27093140970ad3751";		
		periodSchool.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
});

// Test CRUD from Table Peoples
describe("CRUD clase Table Peoples",function(){
	var db, categoryCognition, find;
	var CategoryCognition=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		categoryCognition=new CategoryCognition(db.schema.Peoples);
		find=new  db.schema.Peoples({
			dni:"V12345678",
			name:faker.name.findName(),
			birthDate:faker.date.past(),
			tel:faker.phone.phoneNumber(),
			image:faker.image.people(),
			mode:"TEACHER",
			birthdate:faker.date.past()
		});
		find.save().then(function(){
			done();			
		});
	})
	it("Create Element Peoples",function(done){
		var input={
			dni:"V12545678",
			name:faker.name.findName(),
			birthDate:faker.date.past(),
			tel:faker.phone.phoneNumber(),
			image:faker.image.people(),
			mode:"TEACHER",
			birthdate:faker.date.past()
		};
		categoryCognition.add({dni:input.dni},input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Create duplicated Element Peoples",function(done){
		var input={
			dni:find.dni,
			name:faker.name.findName(),
			birthDate:faker.date.past(),
			tel:faker.phone.phoneNumber(),
			image:faker.image.people(),
			mode:"TEACHER",
			birthdate:faker.date.past()
		};
		categoryCognition.add({dni:input.dni},input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Delete Element Peoples",function(done){
		categoryCognition.remove({dni:find.dni}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element Peoples",function(done){
		var id="V112322123";
		categoryCognition.remove({dni:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Update Element Peoples",function(done){
		var update=faker.name.findName();
		categoryCognition.update({dni:find.dni},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Update not exist Element Peoples",function(done){
		var id="V32434545";
		var update=faker.name.findName();
		categoryCognition.update({dni:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("find Element Peoples",function(done){		
		categoryCognition.find({dni:find.dni}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element Peoples",function(done){
		var id="V243243235";		
		categoryCognition.find({dni:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
});

// Test CRUD from Table Teachers
describe("CRUD clase Table Teachers",function(){
	var db, teacher, find;
	var Teacher=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		teacher=new Teacher(db.schema.Teachers);
		var people=new  db.schema.Peoples({
			dni:"V"+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9),
			name:faker.name.findName(),
			birthDate:faker.date.past(),
			tel:faker.phone.phoneNumber(),
			image:faker.image.people(),
			mode:"TEACHER",
			birthdate:faker.date.past()
		});
		find=new db.schema.Teachers({
			data:people,
			interprete:false
		});
		find.save().then(function(){
			done();			
		}).catch(function(error){
			console.log(error.toString())
		});
	})
	it("Create Element Teachers",function(done){
		var input={
			data:{
				dni:"V"+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9),
				name:faker.name.findName(),
				birthDate:faker.date.past(),
				tel:faker.phone.phoneNumber(),
				image:faker.image.people(),
				mode:"TEACHER",
				birthdate:faker.date.past()
			},
			interprete:true
		};
		teacher.add({"data.dni":input.data.dni},input).then(function(data){
			expect(input.data.name.toUpperCase()).toBe(data.data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Create duplicated Element Teachers",function(done){
		var input={
			data:{
				dni:find.data.dni,
				name:faker.name.findName(),
				birthDate:faker.date.past(),
				tel:faker.phone.phoneNumber(),
				image:faker.image.people()
			},
			interprete:true
		};
		teacher.add({"data.dni":input.data.dni},input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Delete Element Teachers",function(done){
		teacher.remove({"data.dni":find.data.dni}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element Teachers",function(done){
		var id="V112322123";
		teacher.remove({"data.dni":id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Update Element Teachers",function(done){
		var update=faker.name.findName();
		teacher.update({"data.dni":find.data.dni},function(info){
			info.data.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Update not exist Element Teachers",function(done){
		var id="V32434545";
		var update=faker.name.findName();
		teacher.update({"data.dni":id},function(info){
			info.data.name=update;
			return info;
		}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Teachers",function(done){		
		teacher.find({"data.dni":find.data.dni}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element Teachers",function(done){
		var id="V243243235";		
		teacher.find({"data.dni":id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
});

// Test CRUD from Table Students
describe("CRUD clase Table Students",function(){
	var db, student, find;
	var Student=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		student=new Student(db.schema.Students);
		var people=new  db.schema.Peoples({
			dni:"V"+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9),
			name:faker.name.findName(),
			birthDate:faker.date.past(),
			tel:faker.phone.phoneNumber(),
			image:faker.image.people(),
			mode:"STUDENT",
			birthdate:faker.date.past()
		});
		find=new db.schema.Students({
			data:people,
			grade:new  db.schema.Grades({
				name:faker.name.findName()
			}),
			activities:[],
			conflicts:[],
			habilitys:[]
		});
		find.save().then(function(){
			done();
		}).catch(function(error){
			console.log(error.toString());
		});
	})
	it("Create Element Students",function(done){
		var input={
			data:{
				dni:"V"+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9),
				name:faker.name.findName(),
				birthDate:faker.date.past(),
				tel:faker.phone.phoneNumber(),
				image:faker.image.people(),
				mode:"STUDENT",
				birthdate:faker.date.past()
			},
			grade:new  db.schema.Grades({
				name:faker.name.findName()
			}),
			activities:[],
			conflicts:[],
			habilitys:[]
		};
		student.add({"data.dni":input.data.dni},input).then(function(data){
			expect(input.data.name.toUpperCase()).toBe(data.data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Create duplicated Element Students",function(done){
		var input={
			data:{
				dni:find.data.dni,
				name:faker.name.findName(),
				birthDate:faker.date.past(),
				tel:faker.phone.phoneNumber(),
				image:faker.image.people(),
				mode:"STUDENT",
				birthdate:faker.date.past()
			},
			grade:new  db.schema.Grades({
				name:faker.name.findName()
			}),
			activities:[],
			conflicts:[],
			habilitys:[]
		};
		student.add({"data.dni":input.data.dni},input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Delete Element Students",function(done){
		student.remove({"data.dni":find.data.dni}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element Students",function(done){
		var id="V112322123";
		student.remove({"data.dni":id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Update Element Students",function(done){
		var update=faker.name.findName();
		student.update({"data.dni":find.data.dni},function(info){
			info.data.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Update not exist Element Students",function(done){
		var id="V32434545";
		var update=faker.name.findName();
		student.update({"data.dni":id},function(info){
			info.data.name=update;
			return info;
		}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Students",function(done){		
		student.find({"data.dni":find.data.dni}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element Students",function(done){
		var id="V243243235";		
		student.find({"data.dni":id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
});

// Test CRUD from Table Representatives
describe("CRUD clase Table Representatives",function(){
	var db, find, people, student;
	var Student=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		student=new Student(db.schema.Representatives);
		people=new  db.schema.Peoples({
			dni:"V"+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9),
			name:faker.name.findName(),
			birthDate:faker.date.past(),
			tel:faker.phone.phoneNumber(),
			image:faker.image.people(),
			mode:"REPRESENT",
			birthdate:faker.date.past()
		});
		people.save().then(function(){
			find=new db.schema.Representatives({
				data:new  db.schema.Peoples({
					dni:"V"+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9),
					name:faker.name.findName(),
					birthDate:faker.date.past(),
					tel:faker.phone.phoneNumber(),
					image:faker.image.people(),
					mode:"REPRESENT",
					birthdate:faker.date.past()
				}),
				idStudent:people._id
			});
			return find.save();
			
		}).then(function(){
			done();
		});
	})
	it("Create Element Representatives",function(done){
		var input={
			data:{
				dni:"V"+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9)+Math.round(Math.random()*9),
				name:faker.name.findName(),
				birthDate:faker.date.past(),
				tel:faker.phone.phoneNumber(),
				image:faker.image.people(),
				mode:"REPRESENT",
				birthdate:faker.date.past()
			},
			idStudent:people._id
		};
		student.add({"data.dni":input.data.dni},input).then(function(data){
			expect(input.data.name.toUpperCase()).toBe(data.data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Create duplicated Element Representatives",function(done){
		var input={
			data:{
				dni:find.data.dni,
				name:faker.name.findName(),
				birthDate:faker.date.past(),
				tel:faker.phone.phoneNumber(),
				image:faker.image.people(),
				mode:"REPRESENT",
				birthdate:faker.date.past()
			},
			idStudent:people._id
		};
		student.add({"data.dni":input.data.dni},input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Delete Element Representatives",function(done){
		student.remove({"data.dni":find.data.dni}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element Representatives",function(done){
		var id="V112322123";
		student.remove({"data.dni":id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
	it("Update Element Representatives",function(done){
		var update=faker.name.findName();
		student.update({"data.dni":find.data.dni},function(info){
			info.data.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Update not exist Element Representatives",function(done){
		var id="V32434545";
		var update=faker.name.findName();
		student.update({"data.dni":id},function(info){
			info.data.name=update;
			return info;
		}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Representatives",function(done){		
		student.find({"data.dni":find.data.dni}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element Representatives",function(done){
		var id="V243243235";		
		student.find({"data.dni":id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		}).then(function(error){
			expect(error).toBeNull();
			done();
		});
	});
});

// Test CRUD from Table Cognitions
describe("CRUD clase Table Cognitions",function(){
	var db, cognition, find, category;
	var Cognition=require("../src/BackEnd/SoulHand/CRUD.js");
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
			name:faker.name.findName()
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
		}).then(function(error){
			expect(error).toBeNull();
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
			expect(data).toBeNull();
			done();
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
		}).then(function(error){
			expect(error).toBeNull();
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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
		}).catch(function(error){
			expect(error.toString()).toBeNull();
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

/*
// Test CRUD from Table Habilities
describe("CRUD clase Table Habilities",function(){
	var db, find, category, cognition, hability;
	var Hability=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		hability=new Hability(db.schema.Habilities);
		category=new db.schema.CategoryCognitions({
			name:faker.name.findName()			
		});
		category.save().then(function(data){
			cognition=new  db.schema.Cognitions({
				name:faker.name.findName(),
				category:data
			});
			return cognition.save(); 
		}).then(function(){
			find=new db.schema.Habilities({
				name:faker.name.findName(),
				Cognitions:[cognition]
			});
			return find.save();
		}).then(function(){
			done();
		})
	})
	it("Create Element Habilities",function(done){
		var input={
			name:faker.name.findName(),
			Cognitions:[]
		};
		hability.add({name:input.name},input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Create duplicated Element Habilities",function(done){
		var input={
			name:find.name,
			Cognitions:[]
		};
		hability.add({name:input.name},input).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});	
	it("Delete Element Habilities",function(done){
		hability.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element Habilities",function(done){
		var id="58a1c1a27093140970ad3751";
		hability.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("Update Element Habilities",function(done){
		var update=faker.name.findName();
		hability.update({_id:find._id},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Update not exist Element Habilities",function(done){
		var id="58a1c1a27093140970ad3751";
		var update=faker.name.findName();
		hability.update({_id:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element Habilities",function(done){		
		hability.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element Habilities",function(done){
		var id="58a1c1a27093140970ad3751";		
		hability.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		})
	});
});
*/
// Test CRUD from Table ConflictCognitions
describe("CRUD clase Table ConflictCognitions",function(){
	var db, hability, find, category, cognition;
	var Hability=require("../src/BackEnd/SoulHand/CRUD.js");
	afterEach(function(done){
		db.db.dropDatabase(function(){
			db.db.close(function(){
				done();				
			});
		});
	})
	beforeEach(function(done){
		db=utils.getDatabase();
		hability=new Hability(db.schema.ConflictCognitions);
		cognition=new  db.schema.Cognitions({
				name:faker.name.findName(),
		});
		cognition.save().then(function(){
			find=new db.schema.ConflictCognitions({
				name:faker.name.findName(),
				Cognitions:[cognition]
			});
			return find.save();
		}).then(function(){
			done();
		})
	})
	it("Create Element ConflictCognitions",function(done){
		var input={
			name:faker.name.findName(),
			Cognitions:[]
		};
		hability.add({name:input.name},input).then(function(data){
			expect(input.name.toUpperCase()).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Create duplicated Element ConflictCognitions",function(done){
		var input={
			name:find.name,
			Cognitions:[]
		};
		hability.add({name:input.name},input).then(function(error){
			expect(error.toString()).toBeNull();
			done();
		}).catch(function(error){
			expect(error instanceof InsertException).toEqual(true);
			done();
		});
	});	
	it("Delete Element ConflictCognitions",function(done){
		hability.remove({_id:find._id}).then(function(data){
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Delete not exist Element ConflictCognitions",function(done){
		var id="58a1c1a27093140970ad3751";
		hability.remove({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("Update Element ConflictCognitions",function(done){
		var update=faker.name.findName();
		hability.update({_id:find._id},function(info){
			info.name=update;
			return info;
		}).then(function(data){
			expect(update.toUpperCase()).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("Update not exist Element ConflictCognitions",function(done){
		var id="58a1c1a27093140970ad3751";
		var update=faker.name.findName();
		hability.update({_id:id},function(info){
			info.name=update;
			return info;
		}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
	it("find Element ConflictCognitions",function(done){		
		hability.find({_id:find._id}).then(function(data){
			expect(find.name).toBe(data.name);
			done();
		}).catch(function(error){
			expect(error.toString()).toBeNull();
			done();
		});
	});
	it("find not exist Element ConflictCognitions",function(done){
		var id="58a1c1a27093140970ad3751";		
		hability.find({_id:id}).catch(function(error){
			expect(error instanceof VoidException).toEqual(true);					
			done();
		});
	});
});