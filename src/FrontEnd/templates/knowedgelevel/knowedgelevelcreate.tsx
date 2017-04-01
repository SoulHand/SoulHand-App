import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class KnowedgeLevelCreate extends React.Component<, {}> {
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
		min:{
			match:(fn:string)=>{
				return !validator.isNumeric()(fn);
			},
			value:null,
			required:true
		},
		max:{
			match:(fn:string)=>{
				return !validator.isNumeric()()(fn);
			},
			value:null,
			required:true

		},
		
		
				
	};
	state:props.fieldsTeachers={
		error:{

			name:false,
			min:false,
			max:false,
			
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
	        url: `${window.settings.uri}/v1//?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:any)=>{
	        	this.props.router.replace('/knowledgelevel');
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
				    <input type="texto" className="form-control" id="name" aria-describedby="name" maxLength={20} placeholder="Nombre "required autoFocus onChange={(e)=>{this.getFields(e)}}/>
					{this.state.error.name && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> El campo es obligatorio.
						</div>
				    )}				  </div>	
				     <div className="form-group">
				    <label htmlFor="number"><b>Edad Minima</b></label>
				    <input type="number" className="form-control" id="min" aria-describedby="age_min" placeholder="Edad" maxLength={2} onChange={(e)=>{this.getFields(e)}}/>
				    {this.state.error.min && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser un numero valido.
						</div>
				    )}
				  </div>			  
				  	   <div className="form-group">
				    <label htmlFor="number"><b>Edad Maxima</b></label>
				    <input type="number" className="form-control" id="max" aria-describedby="age_max" placeholder="Edad" maxLength={2} onChange={(e)=>{this.getFields(e)}}/>
				    {this.state.error.max && (
				    	<div className="alert alert-danger" role="alert">
						  <strong>Error!</strong> Debe ser un numero valido.
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

