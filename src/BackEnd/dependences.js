var mongoose= require('mongoose');
var Exception=require("./SoulHand/Exceptions/Exception.js");

module.exports=function (app){
	var db = mongoose.createConnection(app.settings.database.dns);
	var structDb=require("./models.js");
	var Schema={};
	for( var i in structDb){
		Schema[i]=db.model(i, structDb[i]);
	}
	return {
		database:{
			db:db,
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
			body.message=error.toString();
			console.log(body.message);
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
