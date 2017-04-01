import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class TeacherCreate extends React.Component<props.teacherItem, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:any={
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
		email:{
			match:validator.isEmail(),
			value:null,
			required:true
		},
		birthdate:{
			match:validator.isDate(),
			value:null,
			required:true
		},
		interprete:{
			value:null
		}
	};
	state:props.fieldsTeachers={
		error:{
			dni:false,
			name:false,
			phone:false,
			email:false,
			birthdate:false,
			server:null
		},
		radio:"no"
	}
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	public getFields(event:any){
		this.fields[event.target.id].value=event.target.value;
	}
	public getRadioButton(event:any){
		this.fields["interprete"].value= (event.target.id=="yes") ? true : undefined
		this.setState({
			radio:event.target.id
		});
	}
	public validate(){
		var value=true;
		var state:props.errorState=this.state.error;
		var data:props.dataTeachers={
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
	        url: `${window.settings.uri}/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:any)=>{
	        	this.props.router.replace('/teacher');
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
		console.log(this, this.state);
    return (
    	<div className="container">    				
    		<form method="POST" className="formulario" onSubmit={(e)=>{this.send(e)}}>
				<label htmlFor="dni"><b>Cedula</b></label>
				    <input type="texto" className="form-control" id="dni" aria-describedby="ci_docente" maxLength={12} placeholder="documento de identidad" required autoFocus onChange={(e)=>{this.getFields(e)}}/>
				    {this.state.error.dni && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Introduzca un documento de identidad valido con la inicial de su nacionalidad.
						</div>
				    )}
				  <div className="form-group">
				    <label htmlFor="name"><b>Nombre y Apellido</b></label>
				    <input type="texto" className="form-control" id="name" aria-describedby="name" maxLength={20} placeholder="Nombre y Apellido"required autoFocus onChange={(e)=>{this.getFields(e)}}/>
					{this.state.error.name && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}				  </div>				  
				  <div className="form-group">
				    <label htmlFor="phone"><b>Telefono</b></label>
				    <input type="texto" className="form-control" id="phone" aria-describedby="Telefono" placeholder="número telefónico" maxLength={12} onChange={(e)=>{this.getFields(e)}}/>
				    {this.state.error.phone && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser un numero de telefono valido.
						</div>
				    )}
				  </div>				  
				   <div className="form-group">
				    <label htmlFor="email"><b>Email </b></label>
				    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Correo Electrónico" onChange={(e)=>{this.getFields(e)}}/>
				    {this.state.error.email && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser un correo electronico.
						</div>
				    )}
				  </div>
				   <div className="form-group">
				    <label htmlFor="birthdate"><b>Fecha de nacimiento </b></label>
				    <input type="date" className="form-control" id="birthdate" aria-describedby="emailHelp" placeholder="YYYY-mm-dd" onChange={(e)=>{this.getFields(e)}}/>
				    {this.state.error.birthdate && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser una fecha valida.
						</div>
				    )}
				  </div>
				  
				  <fieldset className="form-group">
				    <legend><b>Interprete</b></legend>
				    <div className="form-check">
				      <label className="form-check-label">
				        <input type="radio" className="form-check-input" name="interprete" id="yes" value="option1" checked={this.state.radio=="yes"} onChange={(e)=>{this.getRadioButton(e)}}/>
				        Si
				      </label>
				    </div>
				    <div className="form-check">
				    <label className="form-check-label">
				        <input type="radio" className="form-check-input" name="interprete" id="no" value="option2" checked={(this.state.radio!="yes")} onChange={(e)=>{this.getRadioButton(e)}}/>
				        No
				      </label>
				    </div>
				    
				  </fieldset>
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
