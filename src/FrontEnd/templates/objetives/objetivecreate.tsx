import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class ObjetiveCreate extends React.Component<Props.parentsItem, {}> {
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
		level:{
			value:null,
			required:true
		},
		domain:{
			value:null,
			required:true
		},
		objetive:{
      match:validator.isMongoId(),
			value:null,
			required:true
		}
	};
	public state:Props.fieldsTeachers={
		error:{
			name:false,
			level:false,
			domain:false,
			server:null
		},
		domains:[],
		levels:[],
    objetives:[]
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
		var state:Props.errorState=this.state.error;
		var data:Props.dataTeachers={
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
	        url: `${window.settings.uri}/v1/learning/domain/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}).done((data:any)=>{
			   this.setState({
		      domains:data
		    });
		})
	}
  selectDomain(event:any){
    this.getFields(event);
    this.state.domains.forEach((row)=>{
        if(row.name==event.target.value){
          this.setState({
   		      levels:row.levels
   		    });
        }
    });
  }
  selectLevel(event:any){
    this.getFields(event);
    ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/knowedge/${this.fields.domain.value}/objetives/${event.target.value}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:any)=>{
            this.setState({
              objetives:data
            });
	        }
		});
  }
	send(event:any){
		event.preventDefault();
		var data=this.validate();
		if(!data){
			return;
		}
		ajax({
			method:"POST",
	        url: `${window.settings.uri}/v1/activities/${this.props.routeParams.id}/${data.domain}/objetives/${data.level}/${data.objetive}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
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
    		<form method="POST" className="formulario" onSubmit={(e)=>{this.send(e)}}>
        <div className="form-group">
          <label htmlFor="domain"><b>Dominio del aprendizaje*</b></label>
          <select id="domain" required onChange={(e)=>{this.selectDomain(e)}}>
            <option value="">Seleccione una opción</option>
            {
              this.state.domains.map((row)=>{
                return (
                  <option key={row._id} value={row.name}>{row.name}</option>
                );
              })
            }
          </select>
          {this.state.error.domain && (
            <div className="alert alert-danger" role="alert">
            <strong>Error!</strong> Debe ser un curso valido.
          </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="level"><b>Nivel de aprendizaje*</b></label>
          <select id="level" required onChange={(e)=>{this.selectLevel(e)}}>
            <option value="">Seleccione una opción</option>
            {
              this.state.levels.map((row)=>{
                return (
                  <option key={row._id} value={row.name}>{row.name}</option>
                );
              })
            }
          </select>
          {this.state.error.level && (
            <div className="alert alert-danger" role="alert">
            <strong>Error!</strong> Debe ser un curso valido.
          </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="objetive"><b>Objetivo de aprendizaje*</b></label>
          <select id="objetive" required onChange={(e)=>{this.selectLevel(e)}}>
            <option value="">Seleccione una opción</option>
            {
              this.state.objetives.map((row)=>{
                return (
                  <option key={row._id} value={row._id}>{row.name}</option>
                );
              })
            }
          </select>
          {this.state.error.objetive && (
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
