var mongoose= require('mongoose');
var Exception=require("./SoulHand/Exceptions/Exception.js");

module.exports=function (app){
	var db = mongoose.connect(app.settings.database.dns);
	var structDb={
		Peoples:mongoose.Schema({
			dni:{type:String, trim: true, index:true, required: true, unique:true},
			name:{type:String, trim:true, required: true},
			birthDate:{type:Date, required: true},
			createDate:{type:Date, default:Date.now},
			tel:{type:String, required: false},
			image:{type:String, required:false}
		}),
		Grades:mongoose.Schema({
			name:{type:String, required:true, trim:true, index:true}
		}),
		Courses:mongoose.Schema({
			name:{type:String, required:true, trim:true, index:true}
		}),
		PeriodSchools:mongoose.Schema({
			name:{type:String, required:true, trim:true, index:true}
		}),
		CategoryCognitions:mongoose.Schema({
			name:{type:String, required:true, trim:true}
		})
	};
	structDb.Cognitions=mongoose.Schema({
		category:structDb.CategoryCognitions,
		name:{type:String, trim:true}
	});
	structDb.Habilities=mongoose.Schema({
		name:{type:String, trim:true},
		createDate:{type:Date, default:Date.now},
		cognitions:[structDb.Cognitions],
		level:{type:Number,min:0,max:100}
	});
	structDb.Teachers=mongoose.Schema({
		data: structDb.Peoples,
		interprete:{type:Boolean, required:true}
	});
	structDb.Representatives=mongoose.Schema({
		data: structDb.Peoples,
		idStudent:{ type: mongoose.Schema.ObjectId, ref: "Students" }
	});
	structDb.ConflictCognitions=mongoose.Schema({
		name:{type:String, trim:true},
		createDate:{type:Date, default:Date.now},
		cognitions:[structDb.Cognitions],
		level:{type:Number,min:0,max:100}
	});
	structDb.Activities=mongoose.Schema({
		name:{type:String, trim:true},
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
		grade:{ type: String, ref: "Grades" },
		discapacityLevel:{type:Number, required:true, default:0},
		activities:[structDb.ActivitiesMaked],
		conflicts:[structDb.ConflictCognitions],
		habilitys:[structDb.Habilities]
	});
	var Schema={};
	for( var i in structDb){
		Schema[i]=db.model(i, structDb[i]);
	}
	return {
		database:{
			db:mongoose,
			Schema:Schema			
		},
		ErrorHandler:function(error,request,response,next){
			var body={
				code:500,
				message:null
			},status=500;
			if(error instanceof Exception){
				body.code=error.code;
				status=error.status;
			}
			console.log(error);
			body.message=error.toString();
			response.status(status).send(body);	
		}
	};
}
		/*
		Account:mongoose.Schema({
			name:{ type : String, trim : true , unique:true},
		   	code : { type : Number, trim : false, index : true , unique:true },
		   	admin:Boolean,
		   	read:Boolean,
		   	create:Boolean,
		   	update:Boolean,
		   	delete:Boolean,
		   	developer:Boolean
		}),
		User:mongoose.Schema({
			username:{ type : String, trim : true, index : true , unique:true},
		   	password : { type : String, trim : false },
		   	typeAccount:Object,
		   	sessions:Array,
		   	data:Object
		}),
		Sessions:mongoose.Schema({
			privateKey:{ type : String, trim : true, index : true , unique:true},
		   	ip : { type : String, trim : false },
		   	navigator : { type : String, trim : false },
		   	User:Object
		}),
		Themes:mongoose.Schema({
			name:{ type : String, trim : true, unique:true},
		   	code : { type : Number, trim : false, index : true , unique:true },
		   	idCourse:String
		}),
		Activities:mongoose.Schema({
			name:{ type : String, trim : true, unique:true},
		   	code : { type : Number, trim : false, index : true , unique:true },
		   	course:Object,
		   	theme:Object,
		   	cognitions:Array
		}),
		Course:mongoose.Schema({
			name:{ type : String, trim : true, unique:true},
		   	code : { type : Number, trim : false, index : true , unique:true },
		   	Themes:Object
		}),
		Cognitions:mongoose.Schema({
			name:{ type : String, trim : true, unique:true},
		   	code : { type : Number, trim : false, index : true , unique:true }		   	
		})*/
