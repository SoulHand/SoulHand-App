import * as React from 'react';
import * as validator from 'string-validator'
import {Link} from 'react-router'
import {ReactHighcharts} from 'react-highcharts'
import * as Highcharts from 'highcharts/highcharts'
import {ajax} from 'jquery'
import {TableActivities} from './tableactivities'

export class TeacherView extends React.Component<Props.usersItem, props.stateUser {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	state = {
		student:null,
		error:null,
		grades:[],
		activities:[]
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
	componentDidMount(){
		var p1=	ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}),
		p2=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		});	
		Promise.all([p1.done(),p2.done()]).then((data:any)=>{
			this.setState({
		      teacher : data[0],
		      grades: data[1]	      
		    });
		    let p3=ajax({
				method:"GET",
		        url: `${window.settings.uri}/v1/activities/${data[0].grade.name}/${this.props.routeParams.id}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
		        dataType: "json",
		        data:null
			})
			return p3.done();
		}).then((data)=>{
			this.setState({
				activities:data
			});
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
	        url: `${window.settings.uri}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:teachers.profile)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
					teacher:data
				});
	        },
	        error:(data:any)=>{
	        	this.setState({
					error:data.responseJSON.message
				});
	        }
		});
	}
	deleteField(data: any){
		this.state.activities=this.state.activities.filter(function(row:peoples.teachers){
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	this.setState({
	      	activities : this.state.activities
	    });
	}
	render () {
		if(!this.state.teacher){
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
		let styleflex={
			flex:"1 1 50%"
		};
		var valid=[
			{
				name:"dni",
				label:"Documento de identidad",
				value:this.state.teacher.data.dni
			},
			{
				name:"name",
				label:"Nombre y Apellido",
				value:this.state.teacher.data.name
			},
			{
				name:"birthdate",
				label:"Fecha de nacimiento",
				value:this.state.teacher.data.birthdate
			}
		];
		var role=({
			TEACHER: "Docente",
			teacher:"Alumno",
			PARENT:"Representante"
		})[this.state.teacher.data.mode];
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
						{this.state.teacher.data.createDate}
					</div>
				</div>
				<div className="item">
					<div className="field">
						<b>Grado:</b>									
					</div>
					<div className="value">
						<select id="grade" onChange={(e)=>{this.changeGrade(e)}}>
							<option value="">Seleccione una opción</option>
							{
								this.state.grades.map((row)=>{
									var Option =(
										<option key={row._id} value={row._id}>{row.name}</option>										
									);
									if(this.state.teacher.grade && row._id==this.state.teacher.grade._id){
										Option =(
											<option selected={true} key={row._id} value={row._id}>{row.name}</option>										
										);
									}
									return Option;
								})
							}
						</select>
					</div>
				</div>
				<h3>Actividades creadas:</h3>
				<div className="flex row">
					<Link to={`/activities/${this.state.teacher.data.dni}/${this.state.teacher.grade.name}/create`} className="button circle icons x16 add white"></Link>
				</div>
				<TableActivities activities={this.state.activities} session={this.session} delete={this.deleteField.bind(this)}/>
			</div>
    	</div>		
    );
  }	
}