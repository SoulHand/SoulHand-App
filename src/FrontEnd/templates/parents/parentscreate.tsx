import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class ParentsCreate extends React.Component<Props.GenericRouter, states.MatterCreate> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:compat.Map={
		dni:{
			match:validator.matches(/^[VE][0-9]+$/i),
			value:null,
			required:true
		},
		name:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		},
		phone:{
			match:(fn:string)=>{
				return /^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/.test(fn);
			},
			value:null
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
	state:states.MatterCreate={
		error:{
			dni:false,
			name:false,
			phone:false,
			address:false,
			server:null
		}
	}
	constructor(props:Props.GenericRouter) {
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
			dni:null,
			name:null,
			phone:null,
			email:null,
			birthdate:null
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
	        url: `${window.settings.uri}/v1/people/parents/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:any)=>{
	        	this.props.router.replace('/parents');
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
    		<form method="POST" className="formulario" onSubmit={(e:any)=>{this.send(e)}}>
				<label htmlFor="dni"><b>Cedula*</b></label>
				    <input type="texto" className="form-control" id="dni" aria-describedby="ci_respresetante" placeholder="documento de identidad" required autoFocus onChange={(e:any)=>{this.getFields(e)}}/>
				    {this.state.error.dni && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Introduzca un documento de identidad valido con la inicial de su nacionalidad.
						</div>
				    )}
				  <div className="form-group">
				    <label htmlFor="name"><b>Nombre y Apellido*</b></label>
				    <input type="texto" className="form-control" id="name" aria-describedby="name" placeholder="Nombre y Apellido"required autoFocus onChange={(e:any)=>{this.getFields(e)}}/>
					{this.state.error.name && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}				  </div>
				  <div className="form-group">
				    <label htmlFor="phone"><b>Telefono</b></label>
				    <input type="texto" className="form-control" id="phone" aria-describedby="Telefono" placeholder="número telefónico" onChange={(e:any)=>{this.getFields(e)}}/>
				    {this.state.error.phone && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser un numero de telefono valido.
						</div>
				    )}
				  </div>
				  <div className="form-group">
				    <label htmlFor="birthdate"><b>Fecha de nacimiento*</b></label>
				    <input type="date" className="form-control" id="birthdate" aria-describedby="emailHelp" placeholder="YYYY-mm-dd" onChange={(e:any)=>{this.getFields(e)}}/>
				    {this.state.error.birthdate && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser una fecha valida.
						</div>
				    )}
				  </div>
				   <div className="form-group">
				    <label htmlFor="genero"><b>Fecha de nacimiento*</b></label>
				    <select id="genero" required onChange={(e:any)=>{this.getFields(e)}}>
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
