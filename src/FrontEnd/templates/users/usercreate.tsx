import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class UserCreate extends React.Component<props.teacherItem, {}> {
	public fields:any={
		dni:{
			match:validator.matches(/^[VE][0-9]{6,9}$/i),
			value:null,
			required:true
		},
		username:{
			match:validator.isAlphanumeric(),
			value:null,
			required:true
		},
		email:{
			match:validator.isEmail(),
			value:null,
			required:true
		},
		password:{
			match:(fn:string)=>{
				return !validator.isNull()(fn) && validator.isLength(5,12)(fn);
			},
			value:null,
			required:true
		},
		confirm:{
			match:(fn:string)=>{
				return !validator.isNull()(fn) && validator.isLength(5,12)(fn);
			},
			value:null,
			required:true
		}
	};
	state:props.fieldsTeachers={
		error:{
			dni:false,
			name:false,
			password:false,
			email:false,
			confirm:false,
			duplicated:false
		}
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
			password:null,
			email:null,
			confirm:null
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
		if(data.password!=data.confirm){
			value=false;
			state.duplicated=true;
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
		console.log(data);
		ajax({
			method:"POST",
	        url: `${window.settings.uri}/v1/users/`,
	        dataType: "json",
	        data:data,	        
	        success:(data:any)=>{
	        	this.props.router.replace('/auth');
	        },
	        error:(data:any)=>{
	        	var state=this.state.error;
	        	state.server=data.responseJSON.message;
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
			<div className="main">
				<div className="panel-heading">
	               <div className="panel-title text-center">
	               		<h1 className="title">Registro de usuario</h1>
	               		<hr />
	               	</div>
	            </div> 
				<div className="main-login main-center">
					<form className="form-horizontal" method="post" onSubmit={(e)=>{this.send(e)}}>
						
						<div className="form-group">
							<label htmlFor="dni" className="cols-sm-2 control-label">Documento de identidad</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<input type="text" className="form-control" name="dni" id="dni"  placeholder="Documento de identidad" onChange={(e)=>{this.getFields(e)}}/>
								</div>
								{this.state.error.dni && (
							    	<div className="alert alert-danger" role="alert">
									  <strong>Error!</strong> Introduzca un documento de identidad valido con la inicial de su nacionalidad.
									</div>
							    )}
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="email" className="cols-sm-2 control-label">Correo electrónico</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<input type="text" className="form-control" name="email" id="email"  placeholder="ingrese correo electrónico" onChange={(e)=>{this.getFields(e)}}/>
								</div>
								{this.state.error.email && (
							    	<div className="alert alert-danger" role="alert">
									  <strong>Error!</strong> El correo es invalido
									</div>
							    )}
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="username" className="cols-sm-2 control-label">Nombre de usuario</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<input type="text" className="form-control" name="username" id="username"  placeholder="Ingrese su nombre de usuario" onChange={(e)=>{this.getFields(e)}}/>
								</div>
								{this.state.error.username && (
							    	<div className="alert alert-danger" role="alert">
									  <strong>Error!</strong> Es necesario un nombre de usuario
									</div>
							    )}
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="password" className="cols-sm-2 control-label">Contraseña</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<input type="password" className="form-control" name="password" id="password"  placeholder="Ingrese su contraseña" onChange={(e)=>{this.getFields(e)}}/>
								</div>
								{this.state.error.dni && (
							    	<div className="alert alert-danger" role="alert">
									  <strong>Error!</strong> La contraseña debe contener al menos 5 caracteres.
									</div>
							    )}
							</div>
						</div>

						<div className="form-group">
							<label htmlFor="confirm" className="cols-sm-2 control-label">Confirme contraseña</label>
							<div className="cols-sm-10">
								<div className="input-group">
									<input type="password" className="form-control" name="confirm" id="confirm"  placeholder="Confirme su contraseña" onChange={(e)=>{this.getFields(e)}}/>
								</div>
								{this.state.error.dni && (
							    	<div className="alert alert-danger" role="alert">
									  <strong>Error!</strong> La contraseña debe contener al menos 5 caracteres
									</div>
							    )}
							    {this.state.error.duplicated && (
							    	<div className="alert alert-danger" role="alert">
									  <strong>Error!</strong> Las contraseñas no coindicen!
									</div>
							    )}
							</div>
						</div>
						{this.state.error.server && (
					    	<div className="alert alert-danger" role="alert">
							  {this.state.error.server}
							</div>
					    )}
						<div className="form-group ">
							<button type="submit" className="button btn btn-primary btn-lg btn-block login-button">Register</button>
						</div>						
					</form>
				</div>
			</div>
		</div>		
    );
  }
}
