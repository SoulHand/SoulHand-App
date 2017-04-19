const Inferences = require('./inferences.js');
const VoidException = require('../Exceptions/VoidException.js');
const async=require("async");

module.exports=function(db){
	const Inference = new Inferences(db.events);

	Inference.on('physic-add', (physic,people) => {
		Inference.get("PHYSIC").then((data)=>{
			if(!data){
				throw new VoidException("No existe el evento");
			}
			/*for(var i=0 in data.objects){
				data.objects[i]=physic[data.objects[i]];
			}*/
			var result=Inference.apareamiento(data.premises,{
				p1:physic.height,
				p2:people.data.genero,
				p3:physic.weight,
				p4:physic.age
			});
			if(!result){
				throw new VoidException("No hay premisa valida!");				
			}
			return Promise.all([result.q1,people._id]);
		}).then((result)=>{
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