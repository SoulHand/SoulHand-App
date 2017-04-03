import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {TableStudents} from "../students/tablestudents"
import {Link} from 'react-router'


export class ParentView extends React.Component<props.usersItem, props.stateUser {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	state = {
		parent:null,
		error:null
	};
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
    	session=JSON.parse(session);
		this.session=session;
	}
	public getFields(event:any){
		var element=event.target.parentNode;
		this.fields[element.id]=event.target.innerText || event.target.textContent;
	}
	keycod(event:any){
		var element=event.target;
		if(event.keyCode==13){
			event.preventDefault();
			element.parentNode.children[2].children[0].click();
		}
	}
	deleteField(data: Array<peoples.parents>){		
    	this.setState({
	      	teachers : data
	    });		
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:students.profile)=>{
			    this.setState({
			      parent : data
			    });
	        }
		});
	}
	edit(event:any){
		var element=event.target;
		var parent=element.parentNode.parentNode;
		if(element.dataset.save=="false"){
			element.className="button circle icons x16 check white";
			parent.children[1].contentEditable=true;
			element.setAttribute("data-save","true");
			return;
		}
		var data={};
		data[parent.id]=this.fields[parent.id];
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:students.profile)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
					parent:data
				});
	        },
	        error:(data:any)=>{
	        	this.setState({
					error:data.responseJSON.message
				});
	        }
		});
	}
	render () {
		if(!this.state.parent){
			return (
    			<div className="container">
    			{this.state.error && (
					<div className="alert alert-danger" role="alert">
					  {this.state.error}
					</div>
				)}
    				<div className="loadding"></div>
    			</div>
			);
		}
		var valid=[
			{
				name:"dni",
				label:"Documento de identidad",
				value:this.state.parent.data.dni
			},
			{
				name:"name",
				label:"Nombre y Apellido",
				value:this.state.parent.data.name
			},
			{
				name:"birthdate",
				label:"Fecha de nacimiento",
				value:this.state.parent.data.birthdate
			}
		];
		var role=({
			TEACHER: "Docente",
			STUDENT:"Alumno",
			PARENT:"Representante"
		})[this.state.parent.data.mode];
		var Items=valid.map((row)=>{
			return (
				<div className="item" key={row.name} id={row.name}>
					<div className="field">
						<b>{row.label}:</b>									
					</div>
					<div className="value" onKeyUp={(e)=>{this.getFields(e)}} onKeyDown={(e)=>{this.keycod(e)}}>
						{row.value}
					</div>
					<div className="toolbox">
						<button className="button circle icons x16 edit white" data-save={false} title="Editar campo" onClick={(e)=>{this.edit(e)}}></button>
					</div>
				</div>
			);
		});
    return (
    	<div className="container">
			{this.state.error && (
				<div className="alert alert-danger" role="alert">
				  {this.state.error}
				</div>
			)}			
    		<div className="flex row">
				<div className="left_side">
					<img id="profile-img" className="rounded-circle" src="/images/user-login-icon-14.png" />							
				</div>				
			</div>
			<div className="fieldset v-align middle">
				{Items}				
				<div className="item">
					<div className="field">
						<b>Creado en:</b>									
					</div>
					<div className="value">
						{this.state.parent.data.createDate}
					</div>
				</div>
			</div>	
			<h3>Alumnos</h3>
			<div className="flex row">
				<Link to={`/students/create/${this.state.parent._id}`} className="button circle icons x16 add white"></Link>
			</div>
			<h3>Estudiante</h3>
			<TableStudents students={this.state.parent.students} session={this.session} delete={this.deleteField.bind(this)}/>
    	</div>		
    );
  }	
}

