import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';
import {TableObjectivesAdd} from './tableobjetivesadd';

@withRouter
export class ObjetiveCreate extends React.Component<Props.GenericRouter, states.ObjetiveSelect> {
	public session:users.sessions;
	public activity:crud.activity;
	public fields:compat.Map={
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
	public state:states.ObjetiveSelect={
		error:{
			name:false,
			level:false,
			domain:false,
			server:null
		},
		domains:[],
		levels:[],
		objetives:[],
		isAdd:false
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
		let value:{id:string, value:string}=JSON.parse(event.target.value);
		this.fields[event.target.id].value=value.value;
		this.fields[event.target.id].id=value.id;
		this.setState({
			isAdd:(this.fields.domain.value && this.fields.level.value)
		});
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
	changeDomain(event:any){
		this.getFields(event);
		this.fields.level.value=null;
		this.state.domains.forEach(row => {
				if(row._id==this.fields.domain.id){
					this.setState({
						levels:row.levels
					});
				}
		});
	}
	changeLevel(event:any){
		this.getFields(event);
		ajax({
					method:"GET",
	        url: `${window.settings.uri}/v1/knowedge/${this.fields.domain.value}/objetives/${this.fields.level.value}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:Array<crud.objetive>)=>{
						let objetives:Array<crud.objetive>=data.filter((row)=>{
							for(var i in this.activity.objetives){
								if(this.activity.objetives[i]._id==row._id){
									return false;
								}
							}
							return true;
						});
				    this.setState({
				      objetives : objetives
				    });
	        }
		});
	}
	componentDidMount(){
		let p1=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/learning/domain/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}),p2=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/activities/${this.props.routeParams.activity}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		});
		window.Promise.all([p1.done(),p2.done()]).then((data:compat.Map)=>{
			let domain:Array<crud.domain> =data[0];
			this.activity=data[1];
			this.setState({
				domains :domain
			});
		});
	}
	send(event:any){
		event.preventDefault();
		var data=this.validate();
		if(!data){
			return;
		}
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/activities/${this.props.routeParams.activity}/${data.domain}/objetives/${data.level}/${data.objetive}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
	delete(id:string){
			this.state.objetives=this.state.objetives.filter((row)=>{
				if(row._id==id){
					return false;
				}
				return true;
	    });
	  	this.setState({
	      	objetives : this.state.objetives
	    });
	}
	render () {
    return (
    	<div className="container">
					<h1>Asignar objetivos</h1>
					<p>Seleccione de la lista los mejores objetivos que considere el alumno desarrollará con la actividad</p>
					<div className="flex row align-items-center justify-content-sm-center">
							<div className="flex column">
								<label htmlFor="domain"><b>Dominio del aprendizaje*</b></label>
								<select id="domain" required onChange={(e:any)=>{this.changeDomain(e)}}>
								<option value="">Seleccione una opción</option>
								{
									this.state.domains.map((row)=>{
										return (
											<option key={row._id} value={`{"id":"${row._id}","value":"${row.name}"}`}>{row.name}</option>
										);
									})
								}
								</select>
							</div>
							<div className="flex column">
								<label htmlFor="level"><b>Nivel de aprendizaje*</b></label>
								<select id="level" required onChange={(e:any)=>{this.changeLevel(e)}}>
								<option value="">Seleccione una opción</option>
								{
									this.state.levels.map((row)=>{
										return (
											<option key={row._id} value={`{"id":"${row._id}","value":"${row.name}"}`}>{row.name} (Nivel {row.level})</option>
										);
									})
								}
								</select>
							</div>
					</div>
					<br/>
					{this.state.isAdd && (
						<div className="flex column align-items-stretch">
							<Link to={`/objetive/create/${this.fields.domain.id}/${this.fields.level.id}/step1`} className="btn btn-success">Crear un objetivo</Link>
						</div>
					)}
					<TableObjectivesAdd activity={this.props.routeParams.activity} objetives={this.state.objetives} session={this.session} callback={this.delete.bind(this)}/>
    	</div>
    );
  }
}
