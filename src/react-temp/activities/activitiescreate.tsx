import * as React from 'react';
import 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class ActivitiesCreate extends React.Component<Props.GenericRouter, states.MatterList> {
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
		description:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		},
		expire:{
			match:validator.isDate(),
			value:null,
			required:true
		},
		course:{
			value:null,
			required:true
		}
	};
	public state:states.MatterList={
		error:{
			name:false,
			description:false,
			expire:false,
			server:null
		},
		matters:[]
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
			name:null,
			description:null,
			expire:null
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

	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}).done((data:Array<crud.courses>)=>{
			this.setState({
		      matters:data
		    });
		})
	}
	send(event:any){
		event.preventDefault();
		var data=this.validate();
		if(!data){
			return;
		}
		data["teacher"]=this.props.routeParams.id;
		ajax({
			method:"POST",
	        url: `${window.settings.uri}/v1/activities/${this.props.routeParams.grade}/${data.course}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:any)=>{
	        	this.props.router.replace(`/teacher/get/${data.teacher}`);
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

				  <div className="form-group">
				    <label htmlFor="name"><b>Nombre*</b></label>
				    <input type="texto" className="form-control" id="name" aria-describedby="name" placeholder="Nombre"required autoFocus onChange={(e:any)=>{this.getFields(e)}}/>
					{this.state.error.name && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}				  </div>

				    <div className="form-group">
				    <label htmlFor="description"><b>Descripcion*</b></label>
				    <input type="texto" className="form-control" id="description" aria-describedby="description" placeholder="Descripcion"required autoFocus onChange={(e:any)=>{this.getFields(e)}}/>
					{this.state.error.description && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}				  </div>

				  <div className="form-group">
				    <label htmlFor="expire"><b>Expiracion*</b></label>
				    <input type="date" className="form-control" id="expire" aria-describedby="emailHelp" placeholder="YYYY-mm-dd" onChange={(e:any)=>{this.getFields(e)}}/>
				    {this.state.error.expire && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser una fecha valida.
						</div>
				    )}
				  </div>
				  <div className="form-group">
				    <label htmlFor="course"><b>Materia*</b></label>
				    <select id="course" required onChange={(e:any)=>{this.getFields(e)}}>
				    	<option value="">Seleccione una opción</option>
				    	{
				    		this.state.matters.map((row)=>{
				    			return (
				    				<option key={row._id} value={row.name}>{row.name}</option>
				    			);
				    		})
				    	}
				    </select>
				    {this.state.error.course && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser un curso valido.
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
