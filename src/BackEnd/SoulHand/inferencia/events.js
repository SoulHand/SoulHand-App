const Inferences = require('./inferences.js');

module.exports=function(db){
	const myEmitter = new Inferences(db);

	myEmitter.on('physic-add', () => {
	  console.log('an event occurred!');
	});

	myEmitter.on('history', (message) => {
	  console.log(message);
	});
	return myEmitter;
}