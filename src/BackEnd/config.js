module.exports.settings=function(__DIR__){
	return {
		port:8080,
		name:'App',
		database:{
			dns:'mongodb://localhost/SoulHand'
		},
		smtp:{
	       	service: 'Gmail',
	    	auth: {
	        	user: 'usuario',
	        	pass: 'contraseña'
	       }
		}
	}
}