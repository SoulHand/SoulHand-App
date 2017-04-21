import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class AsistAudio extends React.Component<Props.StudentCreate, states.TeacherCreate>{
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
	state:states.TeacherCreate={
		error:{
			name:false,
			server:null
		},
		radio:null
	};
	constructor(props:Props.StudentCreate) {
		super(props);
		let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
	}
	public getRadioButton(event:any){
		this.fields["interprete"].value= (event.target.id=="yes") ? true : undefined
		this.setState({
			radio:event.target.id
		});
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
		console.log(this, this.state);
    return (
    	<div className="container">
    		<form method="POST" className="formulario" onSubmit={(e)=>{this.send(e)}}>
    				<h1 className="title">Pruebas auditivas</h1>
    				<p>A continuación le ayudaremos a evaluar la perdida auditiva del alumno, seleccione las opciones de acuerdo a las observaciones en el entorno de clases.</p>
    				<p><b>¡Recuerde!</b> SoulHand lo apoyará durante todo el proceso de enseñanza pero no podemos reemplazar los diagnosticos de un profesional</p>
				    <div className="form-group">
				    <label htmlFor="weight"><b>Sonidos silencioso</b></label>
				    <p className="small">Observe si el alumno(a) responde a estimulos como los susurros, sonidos dentro de espacios silenciosos incluyendo aparatos electricos (celulares, reproductores, laptos, etc)</p>

				    <p><b>¡Nota!:</b> las observaciones registradas repitala varias veces antes de seleccionar una opción</p>
					{this.state.error.weight && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}</div>				    
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
