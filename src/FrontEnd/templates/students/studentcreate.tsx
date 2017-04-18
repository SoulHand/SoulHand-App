import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class StudentCreate extends React.Component<props.studentItem, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:any={		
		name:{
			match:(fn)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		},
		birthdate:{
			match:validator.isDate(),
			value:null,
			required:true
		},
		birthdate:{
			match:validator.isDate(),
			value:null,
			required:true
		},
		genero:{
			value:null
		}
	};
	state={
		error:{
			dni:false,
			name:false,
			birthdate:false,
			server:null
		}
	};
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
    	session=JSON.parse(session);
		this.session=session;		
	}
	public getFields(event:any){
		this.fields[event.target.id].value=event.target.value;
	}

	public validate(){
		var value=true;
		var state=this.state.error;
		var data={};
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
		data.parent=this.props.routeParams.id;
		ajax({
			method:"POST",
	        url: `${window.settings.uri}/v1/people/students/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:any)=>{
	        	this.props.router.replace(`/parents/get/${this.props.routeParams.id}`);
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
	    return (<div className="container">    				
    		<form method="POST" className="formulario" onSubmit={(e)=>{this.send(e)}}>
					<div className="form-group">
				    <label htmlFor="name"><b>Nombre y Apellido*</b></label>
				    <input type="texto" className="form-control" id="name" aria-describedby="name" maxLength={20} placeholder="Nombre y Apellido"required autoFocus onChange={(e)=>{this.getFields(e)}}/>
					{this.state.error.name && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}</div>
				    <div className="form-group">
				    <label htmlFor="birthdate"><b>Fecha de nacimiento*</b></label>
				    <input type="date" className="form-control" id="birthdate" aria-describedby="emailHelp" placeholder="YYYY-mm-dd" onChange={(e)=>{this.getFields(e)}}/>
				    {this.state.error.birthdate && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser una fecha valida.
						</div>
				    )}
				  </div>				  
				   <div className="form-group">
				    <label htmlFor="genero"><b>Fecha de nacimiento*</b></label>
				    <select id="genero" required onChange={(e)=>{this.getFields(e)}}>
				    	<option value="">Seleccione una opción</option>
				    	<option value="MASCULINO">MASCULINO</option>
				    	<option value="FEMENINO">FEMENINO</option>
				    </select>
				    {this.state.error.genero && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser una fecha valida.
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