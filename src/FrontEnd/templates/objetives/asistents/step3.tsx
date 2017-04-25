import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Step3 extends React.Component<Props.GenericRouter, states.StudentCreate> {
	public session:users.sessions;
  public state:states.StudentCreate={
    error:{
			server:null,
			name:null,
			description:null
		}
  }
	public fields:compat.Map={
		name:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		},
		description:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		}
	};
	constructor(props:Props.GenericRouter) {
			super(props);
			let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
	}
	public getFields(event:any){
		let fields:compat.Map=this.fields;
		fields[event.target.id].value=event.target.value;
	}
	public validate(){
		let fields:compat.Map=this.fields;
		var value=true;
		var state:compat.Map=this.state.error;
		var data:compat.Map={
			dni:null,
			name:null,
			phone:null,
			email:null,
			birthdate:null
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
      url: `${window.settings.uri}/v1/knowedge/${this.props.routeParams.domain}/objetives/${this.props.routeParams.level}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:data,
      success:(data:crud.activity)=>{
      	this.props.router.replace(`/objetive/create/${this.props.routeParams.domain}/${this.props.routeParams.level}/step4/${data._id}`);
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
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>Crear un objetivos de aprendizaje</h1>
				<form method="POST" className="formulario" onSubmit={(e:any)=>{this.send(e)}}>
					<div className="form-group">
					<label htmlFor="name"><b>Nombre del objetivo*</b></label>
					<input type="texto" className="form-control" id="name" aria-describedby="name" placeholder="Nombre del objetivo"required autoFocus onChange={(e:any)=>{this.getFields(e)}}/>
					<p className="small">Seleccione un nombre con al menos un verbo infinitivo que represente la habilidad o actitud del alumno</p>
					{this.state.error.name && (
						<div className="alert alert-danger" role="alert">
						<strong>Error!</strong> El campo es obligatorio.
						</div>
					)}
					</div>
					<div className="form-group">
					<label htmlFor="description"><b>Descripción del objetivo*</b></label>
					<textarea className="form-control" id="description" aria-describedby="description" placeholder="Descripción del objetivo"required onChange={(e:any)=>{this.getFields(e)}}/>
					{this.state.error.description && (
						<div className="alert alert-danger" role="alert">
						<strong>Error!</strong> El campo es obligatorio.
						</div>
					)}
					</div>
					{this.state.error.server && (
						<div className="alert alert-danger" role="alert">
							{this.state.error.server}
						</div>
					)}
					<div className="flex column align-items-stretch">
						<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
						<button className="button btn-success" type="submit">Continuar</button>
					</div>
				</form>
			</div>
    );
  }
}
