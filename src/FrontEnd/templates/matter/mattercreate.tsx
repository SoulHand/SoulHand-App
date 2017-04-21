import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class MatterCreate extends React.Component<Props.TeacherCreate, states.MatterCreate> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:compat.Map={
		name:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		},
	};
	state:states.MatterCreate={
		error:{}
	}
	constructor(props:Props.TeacherCreate) {
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
		let fields: compat.Map = this.fields;
		var value=true;
		var state:compat.Map=this.state.error;
		var data:compat.Map={
			name:null
		};
		for (var i in fields){
			if( (fields[i].require && !fields[i].value) || (fields[i].match && !fields[i].match(fields[i].value))){
				value=false;
				state[i]=true;
				continue;
			}
				data[i]=fields[i].value;
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
	        url: `${window.settings.uri}/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:any)=>{
	        	this.props.router.replace('/matter');
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
					    <label htmlFor="name"><b>Nombre </b></label>
					    <input type="texto" className="form-control" id="name" aria-describedby="name" placeholder="Nombre "required autoFocus onChange={(e)=>{this.getFields(e)}}/>
							{this.state.error.name && (
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
