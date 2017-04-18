var mongoose= require('mongoose');
var encode=function(str){
	const base64=require('base-64');
	return base64.encode(str);
};

var structDb={	
	Grades:mongoose.Schema({
		name:{type:String, required:true, trim:true, uppercase: true}
	}),
	Courses:mongoose.Schema({
		name:{type:String, required:true, trim:true, uppercase: true}
	}),
	PeriodSchools:mongoose.Schema({
		name:{type:String, required:true, trim:true, uppercase: true}
	}),
	type_morphema:mongoose.Schema({
		name:{type:String, required:true, trim:true, uppercase: true}
	}),
	mode_morphema:mongoose.Schema({
		name:{type:String, required:true, trim:true, uppercase: true}
	}),
	nivelDomain:mongoose.Schema({
		name:{type:String, required:true, trim:true, uppercase: true},
		level:{type:Number},
		words:[]
	}),
	physic:mongoose.Schema({
		date:{type:Date, default:Date.now},
		weight:{type:Number, required:true, min:0},
		height:{type:Number, required:true, min:0},
		age:{type:Number, required:true, min:0}
	}),
	inferences:mongoose.Schema({
		premise:{type:String, trim:true},
		consecuent:{type:String, trim:true},
		h:{type:Number, default:1}
	}),
	weights:mongoose.Schema({
		height:{type:Number, min:0},
		min:{type:Number, min:0},
		max:{type:Number, min:0},
		genero:{type:String, trim:true, uppercase:true}
	}),
	heights:mongoose.Schema({
		age:{type:Number, min:0},
		min:{type:Number, min:0},
		max:{type:Number, min:0},
		genero:{type:String, trim:true, uppercase:true}
	}),	
	Peoples:mongoose.Schema({
		dni:{type:String, trim: true, index:true, required: true, unique:true, uppercase: true},
		name:{type:String, trim:true, required: true, uppercase: true},
		birthdate:{type:String, required: true},
		createDate:{type:Date, default:Date.now},
		tel:{type:String, required: false},
		image:{type:String, required:false},
		mode:{type:String, required:true},
		genero:{type:String, trim:true, uppercase: true}
	})
};
structDb.Teachers=mongoose.Schema({
	data: structDb.Peoples,
	interprete:{type:Boolean, required:true}
});
structDb.Representatives=mongoose.Schema({
	data: structDb.Peoples,
	students:[{ type: mongoose.Schema.ObjectId, ref: "Students" }]
});

structDb.User=mongoose.Schema({
	username:{ type : String, trim : true, index : true , unique:true},
   	password : { type : String, set:encode},
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

structDb.morphems=mongoose.Schema({
	type:structDb.type_morphema,
	mode:structDb.mode_morphema,
	key:{type:String, required:true, trim:true, uppercase: true}
});
structDb.lexemas=mongoose.Schema({
	key:{type:String, required:true, trim:true, uppercase: true},
	morphems:structDb.morphems
});
structDb.words=mongoose.Schema({
	key:{type:String, required:true, trim:true, uppercase: true},
	lexema:structDb.lexemas,
	concept:{type:String, required:true, trim:true, uppercase: true}	
});
structDb.Cognitions=mongoose.Schema({
	name:{type:String, required:true, trim:true, uppercase: true},
	description:{type:String, required:true, trim:true, uppercase: true},
	words:[structDb.words]
})
structDb.domainsLearning=mongoose.Schema({
	name:{type:String, required:true, trim:true, uppercase: true},
	description:{type:String, required:true, trim:true, uppercase: true},
	cognitions:[structDb.Cognitions],
	levels:[structDb.nivelDomain],
	words:[structDb.words]
});
structDb.LearningObjetive=mongoose.Schema({
	name:{type:String, trim:true, required: true, uppercase: true},
	description:{type:String, trim:true, required: false, uppercase: true},
	domain:{
		_id:{ type: mongoose.Schema.ObjectId, ref: "domainsLearning" },
		name:{type:String, trim:true, uppercase: true}
	},
	level:{
		_id:{ type: mongoose.Schema.ObjectId, ref: "nivelDomain" },
		name:{type:String, trim:true, uppercase: true},
		level:{type:Number}
	},
	cognitions:[structDb.Cognitions],
   	dateCreated:{ type: Date, default: Date.now },
	words:[structDb.words],
	completed:{type:Number}
});
structDb.Students=mongoose.Schema({
	data: structDb.Peoples,
	grade:structDb.Grades,
	discapacityLevel:{type:Number, required:true, default:0},
	physics:[structDb.physic],
	domain:{ type: mongoose.Schema.ObjectId, ref: "domainsLearning" },
	objetives:[structDb.LearningObjetive]
});

structDb.Activities=mongoose.Schema({
	name:{type:String, trim:true, required: true, uppercase: true},
	description:{type:String, trim:true, required: true, uppercase: true},
	objetives:[structDb.LearningObjetive],
	isCompleted:{type:Boolean,default:false},
   	dateCreated:{ type: Date, default: Date.now },
   	dateExpire:{ type: Date, required:true },
   	teacher: { type: mongoose.Schema.ObjectId, ref: "Teachers" },
	student: [{ type: mongoose.Schema.ObjectId, ref: "Students" }],
	grade:structDb.Grades,
	course:structDb.Courses,
	dateCreated:{ type: Date, default: Date.now }
});
structDb.events=mongoose.Schema({
	name:{type:String, trim:true,uppercase: true},
	objects:{type:Object},
	premises:[structDb.inferences]
})

/*
structDb.ConflictCognitions=mongoose.Schema({
	name:{type:String, trim:true, uppercase: true},
	createDate:{type:Date, default:Date.now},
	cognitions:[structDb.Cognitions],
	level:{type:Number,min:0,max:100,default:0}
});

*/




/*
structDb.Learning=mongoose.Schema({
	name:{type:String, required:true, trim:true, uppercase:true}
});






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
		name:{ type : String, trim : true, uppercase:true},
		value:{type:Number,min:0,max:100}
	});
	structDb.SerieInteligence=mongoose.Schema({
		name:{ type : String, trim : true, uppercase:true},
		items:[structDb.ItemsInteligence],
		age:{
			min:{type:Number,min:0,max:100},
			max:{type:Number,min:0,max:120}
		},
		length:{type:Number,min:0}
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
			"65":{type:Number,min:0}
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
			"65":{type:Number,min:0}
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
			"65":{type:Number,min:0}
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
			"65":{type:Number,min:0}
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
			"65":{type:Number,min:0}
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
			"65":{type:Number,min:0}
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
			"65":{type:Number,min:0}
		}
	});
	structDb.TestInteligence=mongoose.Schema({
		name:{ type : String, trim : true, uppercase: true},
		serie:[structDb.SerieInteligence],
	   	dateCreated:{ type: Date, default: Date.now },
	   	range:structDb.RangeInteligence
	});	
	structDb.serieStudent=mongoose.Schema({
		name:{ type : String, trim : true,uppercase: true},
		items:[structDb.ItemsInteligence],
		value:{type:Number,min:0}
	});
	structDb.groupsInteligence=mongoose.Schema({
		name:{ type : String, trim : true, uppercase: true},
		range:{
			min:{type:Number,min:0,max:100},
			max:{type:Number,min:0,max:120}
		},
		simbol:{ type : String, trim : true, uppercase: true}
	});
	structDb.testIntStudent=mongoose.Schema({
		name:{ type : String, trim : true,uppercase: true},
		serie:[structDb.serieStudent],
	   	dateCreated:{ type: Date, default: Date.now },
	   	value:{type:Number,min:0,max:100},
	   	percentil:{type:Number,min:0,max:100},
	   	group:structDb.groupsInteligence,
	   	time:{type:Number,min:0}
	});
	structDb.Students=mongoose.Schema({
		data: structDb.Peoples,
		grade:structDb.Grades,
		discapacityLevel:{type:Number, required:true, default:0},
		activities:[structDb.ActivitiesMaked],
		conflicts:[structDb.ConflictCognitions],
		habilitys:[structDb.Habilities],
		test:[structDb.testIntStudent],
	   	group:structDb.groupsInteligence
	});*/
module.exports=structDb;