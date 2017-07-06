process.env.PORT = 8080;
process.env["DATABASE"] = "mongodb://localhost/SoulHand";

module.exports.settings=function(__DIR__){
	return {
		name:'App',
		smtp:{
	       	service: 'Gmail',
	    	auth: {
	        	user: 'usuario',
	        	pass: 'contraseña'
	       }
		}
	}
}
