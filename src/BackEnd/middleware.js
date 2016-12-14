module.exports=function(app,express,server,__DIR__){	
	//ErrorHandler
	app.use(function(error,req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
		    message: err.message, 
		    error: err
		});
	});	
}