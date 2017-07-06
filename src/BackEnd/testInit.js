var User=require("./SoulHand/User.js");
var VoidException=require("./SoulHand/Exceptions/VoidException.js");
const logger = require('winston');

module.exports=function(Schema){
	const uuidV4 = require('uuid/v4');
	var admin=new User(Schema.User);
	var password=uuidV4();
	var people= new Schema.Peoples({
		dni:password,
		name:"ROOT USER",
		birthdate:"1970-01-01",
		mode:"TEACHER"
	});
  Schema.User.findOne({isAdmin:true}).then((data) => {
    if (data) {
      return data;
    }
    people.save().then(function(){
      return admin.add({
        username:"root",
        password:password,
        isAdmin:true,
        people:people
      });
    }).then(function(data){
      logger.debug("No existe usuario root, el sistema ha insertado un usuario\nUsuario:"+data.username+"\npassword:"+password);
      let teacher = new Schema.Teachers({
        data: people,
        interprete:false
      });
      return teacher.save();
    })
  });
}
