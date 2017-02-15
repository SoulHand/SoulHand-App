var mongoose= require('mongoose');
var structDb={
		Peoples:mongoose.Schema({
			dni:{type:String, trim: true, index:true, required: true, unique:true, uppercase: true},
			name:{type:String, trim:true, required: true, uppercase: true},
			birthdate:{type:String, required: true},
			createDate:{type:Date, default:Date.now},
			tel:{type:String, required: false},
			image:{type:String, required:false},
			mode:{type:String, required:true}
		}),
		Grades:mongoose.Schema({
			name:{type:String, required:true, trim:true, uppercase: true}
		}),
		Courses:mongoose.Schema({
			name:{type:String, required:true, trim:true, uppercase: true}
		}),
		PeriodSchools:mongoose.Schema({
			name:{type:String, required:true, trim:true, uppercase: true}
		}),
		CategoryCognitions:mongoose.Schema({
			name:{type:String, required:true, trim:true, uppercase: true}
		})
	};
	structDb.Cognitions=mongoose.Schema({
		category:structDb.CategoryCognitions,
		name:{type:String, trim:true, uppercase: true}
	});
	structDb.Teachers=mongoose.Schema({
		data: structDb.Peoples,
		interprete:{type:Boolean, required:true}
	});
	structDb.Representatives=mongoose.Schema({
		data: structDb.Peoples,
		idStudent:{ type: mongoose.Schema.ObjectId, ref: "Students" }
	});
	structDb.Habilities=mongoose.Schema({
		name:{type:String, trim:true, uppercase: true},
		createDate:{type:Date, default:Date.now},
		cognitions:[structDb.Cognitions],
		level:{type:Number,min:0,max:100, default:0}
	});
	structDb.ConflictCognitions=mongoose.Schema({
		name:{type:String, trim:true, uppercase: true},
		createDate:{type:Date, default:Date.now},
		cognitions:[structDb.Cognitions],
		level:{type:Number,min:0,max:100,default:0}
	});
	structDb.Activities=mongoose.Schema({
		name:{type:String, trim:true, uppercase: true},
		TeacherCreate:structDb.Teachers,
		createDate:{type:Date, default:Date.now},
		course:structDb.Courses,
		range:{
			level:{type:Number,min:0,max:100},
			min:{type:Number, min:0},
			max:{type:Number, min:0}
		},
		conflicts:[structDb.ConflictCognitions],
		habilitys:[structDb.Habilities]
	});
	structDb.ActivitiesMaked=mongoose.Schema({
		activity:structDb.Activities,
		createDate:{type:Date, default:Date.now},
		completeDate:{type:Date, required:false},
		limitDate:{type:Date, min:Date.now},
		ponderation:{type:Number,min:0,max:20},
		conflicts:[structDb.ConflictCognitions],
		habilitys:[structDb.Habilities]
	});
	structDb.Students=mongoose.Schema({
		data: structDb.Peoples,
		grade:structDb.Grades,
		discapacityLevel:{type:Number, required:true, default:0},
		activities:[structDb.ActivitiesMaked],
		conflicts:[structDb.ConflictCognitions],
		habilitys:[structDb.Habilities]
	});
	structDb.User=mongoose.Schema({
		username:{ type : String, trim : true, index : true , unique:true},
	   	password : { type : String },
	   	email:{ type : String, trim : true, unique:true},
	   	dateCreated:{ type: Date, default: Date.now },
	   	dateConfirmed:Date,
	   	dateDelete:Date,
	   	people:structDb.Peoples,
	   	isAdmin:{type:Boolean, default:false}
	});	
	structDb.Sessions=mongoose.Schema({
		privateKeyId:{ type : String, trim : true, index : true , unique:true},
		publicKeyId:{ type : String, trim : true},
	   	ip : { type : String, trim : false },
	   	navigator : { type : String, trim : false },
	   	dateCreated:{ type: Date, default: Date.now },
	   	dateDeleted:Date,
	   	dateLastConnect:Date,
	   	user:{ type: mongoose.Schema.ObjectId, ref: "User" }
	});
module.exports=structDb;