import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class PhysicCreate extends React.Component<Props.StudentCreate, states.MatterCreate> {
	public session:users.sessions;
	public fields:compat.Map={
		weight:{
			match:validator.isFloat(),
			value:null,
			required:true
		},
		height:{
			match:validator.isFloat(),
			value:null,
			required:true
		}
	};
	state:states.MatterCreate={
		error:{
			name:false,
			server:null
		},

	};
	constructor(props:Props.StudentCreate) {
		super(props);
		let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
	}
	public getFields(event:any){
		this.fields[event.target.id].value=event.target.value;
	}
	public validate(){
		var value=true;
		var state:compat.Map=this.state.error;
		var data:compat.Map={
			weight:null,
			height:null
		};
		for (var i in this.fields){
			if( (this.fields[i].require && !this.fields[i].value) || (this.fields[i].match && !this.fields[i].match(this.fields[i].value))){
				value=false;
				state[i]=true;
				continue;
			}
				data[i]=this.fields[i].value;
				state[i]=false;
		}
		state.server=null;
		if(!value){
			this.setState({
				error:state
			});
			return false;
		}
		return data;
	}
	send(event:any){
		event.preventDefault();
		var data=this.validate();
		if(!data){
			return;
		}
		ajax({
			method:"POST",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}/physic/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:any)=>{
	        	this.props.router.replace(`/students/get/${this.props.routeParams.id}`);
	        },
	        error:(data:any)=>{
	        	var state=this.state.error;
	        	state.server=data.responseJSON;
	        	this.setState({
					error:state
				});
	        }
		});
	}
		render () {
    return (
    	<div className="container">
    		<form method="POST" className="formulario" onSubmit={(e)=>{this.send(e)}}>
				<div className="form-group">
					<label htmlFor="height"><b>Altura</b></label>
					<input type="text" className="form-control" id="height" aria-describedby="name" placeholder="cm" required autoFocus onChange={(e)=>{this.getFields(e)}}/>
					{this.state.error.height && (
						<div className="alert alert-danger" role="alert">
						<strong>Error!</strong> El campo es obligatorio.
						</div>
					)}
				</div>
		    <div className="form-group">
			    <label htmlFor="weight"><b>Peso</b></label>
			    <input type="text" className="form-control" id="weight" aria-describedby="name" placeholder="kg" required autoFocus onChange={(e)=>{this.getFields(e)}}/>
					{this.state.error.weight && (
			    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
			    )}
				</div>
		  	{this.state.error.server && (
		    	<div className="alert alert-danger" role="alert">
				  {this.state.error.server.message}
				</div>
		    )}
				<button type="submit" className="btn btn-primary">Guardar</button>
				</form>
    	</div>
    );
  }
}
