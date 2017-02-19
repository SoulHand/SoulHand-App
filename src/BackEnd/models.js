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
		Cognitions:mongoose.Schema({
			name:{type:String, trim:true, uppercase: true}
		})		
	};
	structDb.CategoryCognitions=mongoose.Schema({
		name:{type:String, required:true, trim:true, uppercase: true},
		cognitions:[structDb.Cognitions]
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
	structDb.CategoryHabilities=mongoose.Schema({
		name:{type:String, trim:true, uppercase: true},
		createDate:{type:Date, default:Date.now},
		habilities:[structDb.Habilities]
	});
	structDb.ConflictCognitions=mongoose.Schema({
		name:{type:String, trim:true, uppercase: true},
		createDate:{type:Date, default:Date.now},
		cognitions:[structDb.Cognitions],
		level:{type:Number,min:0,max:100,default:0}
	});
	structDb.Activities=mongoose.Schema({
		name:{type:String, trim:true, uppercase: true},
		description:{type:String,trim:true,uppercase:true},
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
	structDb.ItemsInteligence=mongoose.Schema({
		name:{ type : String, trim : true},
		age:{
			min:{type:Number,min:0,max:100},
			max:{type:Number,min:0,max:120}
		},
		value:{
			min:{type:Number,min:0,max:100},
			max:{type:Number,min:0,max:100},
			correct:{type:Number,min:0,max:100}
		}
	});
	structDb.SerieInteligence=mongoose.Schema({
		name:{ type : String, trim : true},
		items:[structDb.ItemsInteligence]
	});
	structDb.RangeInteligence=mongoose.Schema({
		"5":{
			"20":{type:Number,min:0},
			"25":{type:Number,min:0},
			"30":{type:Number,min:0},
			"35":{type:Number,min:0},
			"40":{type:Number,min:0},
			"45":{type:Number,min:0},
			"50":{type:Number,min:0},
			"55":{type:Number,min:0},
			"60":{type:Number,min:0},
			"65":{type:Number,min:0},
		},
		"10":{
			"20":{type:Number,min:0},
			"25":{type:Number,min:0},
			"30":{type:Number,min:0},
			"35":{type:Number,min:0},
			"40":{type:Number,min:0},
			"45":{type:Number,min:0},
			"50":{type:Number,min:0},
			"55":{type:Number,min:0},
			"60":{type:Number,min:0},
			"65":{type:Number,min:0},
		},
		"25":{
			"20":{type:Number,min:0},
			"25":{type:Number,min:0},
			"30":{type:Number,min:0},
			"35":{type:Number,min:0},
			"40":{type:Number,min:0},
			"45":{type:Number,min:0},
			"50":{type:Number,min:0},
			"55":{type:Number,min:0},
			"60":{type:Number,min:0},
			"65":{type:Number,min:0},
		},
		"50":{
			"20":{type:Number,min:0},
			"25":{type:Number,min:0},
			"30":{type:Number,min:0},
			"35":{type:Number,min:0},
			"40":{type:Number,min:0},
			"45":{type:Number,min:0},
			"50":{type:Number,min:0},
			"55":{type:Number,min:0},
			"60":{type:Number,min:0},
			"65":{type:Number,min:0},
		},
		"75":{
			"20":{type:Number,min:0},
			"25":{type:Number,min:0},
			"30":{type:Number,min:0},
			"35":{type:Number,min:0},
			"40":{type:Number,min:0},
			"45":{type:Number,min:0},
			"50":{type:Number,min:0},
			"55":{type:Number,min:0},
			"60":{type:Number,min:0},
			"65":{type:Number,min:0},
		},
		"90":{
			"20":{type:Number,min:0},
			"25":{type:Number,min:0},
			"30":{type:Number,min:0},
			"35":{type:Number,min:0},
			"40":{type:Number,min:0},
			"45":{type:Number,min:0},
			"50":{type:Number,min:0},
			"55":{type:Number,min:0},
			"60":{type:Number,min:0},
			"65":{type:Number,min:0},
		},
		"95":{
			"20":{type:Number,min:0},
			"25":{type:Number,min:0},
			"30":{type:Number,min:0},
			"35":{type:Number,min:0},
			"40":{type:Number,min:0},
			"45":{type:Number,min:0},
			"50":{type:Number,min:0},
			"55":{type:Number,min:0},
			"60":{type:Number,min:0},
			"65":{type:Number,min:0},
		}
	});
	structDb.TestInteligence=mongoose.Schema({
		name:{ type : String, trim : true, index : true , unique:true},
		serie:[structDb.SerieInteligence],
	   	dateCreated:{ type: Date, default: Date.now },
	   	range:structDb.RangeInteligence
	});
module.exports=structDb;