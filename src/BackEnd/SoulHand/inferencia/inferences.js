const EventEmitter = require('events');

class Inferences extends EventEmitter{
	constructor(db) {
		super();
		this.db = db;
	}
	get(event){
		return this.db.findOne({
			name:event			
		});
	}
	ModusPones(premises,var_globals){
		var keys=Object.keys(var_globals);
		var exp=new RegExp(`([xp-t][0-9]+)`,'g');
		var consecuents=[];
		while(premises.length){
			var row=premises.shift();
			var premise=row.premise.replace(exp,"var_globals.$1");
			var p1=eval(premise);
			if(p1){
				var vars={};
				var consecuent=row.consecuent.replace(exp,"vars.$1");
				eval(consecuent);
				for(var i in vars){
					var_globals[i]=vars[i];
				}
				consecuents.push(vars);
			}
		}
		return consecuents;
	}
	apareamiento(premises,var_globals){
		var exp=new RegExp('([p-t][0-9]+)','g');
		var matchs=[];
		premises.forEach((premise)=>{
			var condition=premise.premise.replace(exp,"var_globals.$1");
			var p1=eval(condition);
			if(p1){
				matchs.push(premise);
			}
		});
		if(matchs.length==0){
			return false;
		}
		//var index=Math.round((matchs.length-1)*Math.random());
		//var premise=matchs[index];
		var premise;
		matchs.forEach((row)=>{
			if(!premise){
				premise=row;
			}
			if(premise.h<row.h){
				premise=row;
			}
		});
		var vars={};
		var consecuent=premise.consecuent.replace(exp,"vars.$1");
		eval(consecuent);
		return vars;
	}
	propagation(premises,var_globals){
		var results=var_globals.map((row)=>{
			return this.apareamiento(premises,row);			
		});
		return results;
	}
}
module.exports=Inferences;