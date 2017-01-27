var path = require('path');
module.exports=function(app,express,server,__DIR__){
	//var router = express.Router();
	app.use(express.static(path.resolve(__DIR__, 'public')));
	app.route('/v1')
	.get(function(req, res) {  
	   	res.send({hola:true});
	});
	//app.use(router);
}