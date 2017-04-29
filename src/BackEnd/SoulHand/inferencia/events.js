const Inferences = require('./inferences.js');
const VoidException = require('../Exceptions/VoidException.js');
const async=require("async");

module.exports=function(db){
	const Inference = new Inferences(db.events);

	Inference.on('physic-add', (physic,people) => {
		Inference.get("PHYSIC").then((data)=>{
			if(!data){
				var helpEvent=new app.container.database.Schema.events({
					name:"PHYSIC",
					objects:{
						p1:"physic.height",
						p2:"people.data.genero",
						p3:"physic.weight",
						p4:"physic.age"
					}
				});
				helpEvent.save();
				return false;
			}
			var result=Inference.ChainGetOne(data.premises,{
				p1:physic.height,
				p2:people.data.genero,
				p3:physic.weight,
				p4:physic.age
			});
			if(!result){
				return false;
			}
			return Promise.all([result.q1,people._id]);
		}).then((result)=>{
			if(!result){
				throw new ValidatorException("No existe un conocimiento!");
			}
			Inference.emit('history-students',result[0],result[1]);
		})/*.catch((error)=>{
			console.log(error.toString());
		});*/
	});

	Inference.on('history-students', (message,student) => {
		db.Students.findOne({_id:student}).then((data)=>{
			if(!data){
				throw new VoidException("No existe el alumno!");
			}
			var history=new db.HistoryLearning({
				description:message
			});
			data.history.push(history);
			return data.save();
		})
	});
	return Inference;
}
