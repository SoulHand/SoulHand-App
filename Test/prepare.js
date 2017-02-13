var mongoose= require('mongoose');
var settings= require('../src/BackEnd/config.js').settings();
var db = mongoose.connect(settings.database.dnsTest);
	var structDb=require("../src/BackEnd/models.js");
	var Schema={};
	for( var i in structDb){
		Schema[i]=db.model(i, structDb[i]);
	}
module.exports=Schema;