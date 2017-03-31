import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class MatterCreate extends React.Component<props.parentsItem, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:any={
		
		name:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		},
		
		
				
	};
	state:props.fieldsTeachers={
		error:{
			dni:false,
			name:false,
			server:null
		},

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
	
	public validate(){
		var value=true;
		var state:props.errorState=this.state.error;
		var data:props.dataTeachers={
			dni:null,
			name:null,
			
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
	        url: `//0.0.0:8080/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:any)=>{
	        	this.props.router.replace('/materia');
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
			
				  <div className="form-group">
				    <label htmlFor="name"><b>Nombre </b></label>
				    <input type="texto" className="form-control" id="name" aria-describedby="name" maxLength={20} placeholder="Nombre y Apellido"required autoFocus onChange={(e)=>{this.getFields(e)}}/>
					{this.state.error.name && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}				  </div>				  
				  	  
				   
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
