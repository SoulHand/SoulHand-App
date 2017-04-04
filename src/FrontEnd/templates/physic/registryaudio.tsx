import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class RegistryAudio extends React.Component<{}, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:any={	
		discapacityLevel:{
			match:validator.isFloat(),
			value:null,
			required:true
		},
	};
	state:props.fieldsTeachers={
		error:{
			
			discapacityLevel:false,
			server:null
		},
		
	};
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	public getFields(event:any){
		this.fields[event.target.id].value=event.target.value;
	}
	public validate(){
		var value=true;
		var state:props.errorState=this.state.error;
		var data:props.dataTeachers={			
			discapacityLevel:null			
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
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
    			<label className="title">Seleccione la escala de perdida de audicación considerada</label>
				    <div className="form-group">
					    <select id="discapacityLevel" onChange={(e)=>{this.getFields(e)}} required>
					    	<option value="">Seleccione una opción</option>
					    	<option value="33">LEVE</option>
					    	<option value="55">MODERADA</option>
					    	<option value="80">SEVERA</option>
					    	<option value="105">PROFUNDA</option>
					    </select>
						<div className="small">Puede guiarse con un resultado de una prueba de audición médica para ser mas exacto</div>
					</div>
				  	{this.state.error.discapacityLevel && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error</strong> es necesario el campo
						</div>
				    )}
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
