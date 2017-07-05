
process.env.PORT = 8080;

module.exports.settings=function(__DIR__){
	return {
		port:8080,
		name:'App',
		database:{
			dns:'mongodb://localhost/SoulHand',
			dnsTest:'mongodb://localhost/soulhand_test'
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
