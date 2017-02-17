var path = require('path');
var Auth = require('./SoulHand/Auth.js');

module.exports=function(app,express,server,__DIR__){	
	app.use(express.static(path.resolve(__DIR__, 'public')));
	app.use("/v1/activities",Auth.isTeacher.bind(app.container));
	app.use("/v1/conflicts",Auth.isTeacherOrNot.bind(app.container));
}
