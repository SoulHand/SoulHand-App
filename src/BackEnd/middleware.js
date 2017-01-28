var path = require('path');

module.exports=function(app,express,server,__DIR__){	
	app.use(express.static(path.resolve(__DIR__, 'public')));
}