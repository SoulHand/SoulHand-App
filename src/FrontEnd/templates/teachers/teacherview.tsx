import * as React from 'react';
import 'string-validator'
import {Link} from 'react-router'
import {ajax} from 'jquery'
import {TableActivities} from './tableactivities'

export class TeacherView extends React.Component<Props.TeacherView,states.TeacherView>{
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	state: states.TeacherView = {
		teacher:null,
		error:null,
		grades:[],
		activities:[]
	};
	constructor(props:Props.TeacherView) {
		super(props);
		let str: string=localStorage.getItem("session");
  	if(str){
			let session:users.sessions = JSON.parse(str);
    	this.session=session;
  	}
	}
	public getFields(event:any){
		let fields:compat.Map=this.fields;
		var element=event.target.parentNode;
		fields[element.id]=event.target.innerText || event.target.textContent;
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
		window.Promise.all([p1.done(),p2.done()]).then((data:any)=>{
			let teacher: peoples.teachers = data[0];
			let grades: Array<crud.grade> = data[1];
			this.setState({
	      teacher : teacher,
	      grades:grades
	    });
			if(!data[0].grade){
				return null;
			}
			let p3=ajax({
				method:"GET",
				url: `${window.settings.uri}/v1/activities/${data[0].grade.name}/${this.props.routeParams.id}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
				dataType: "json",
				data:null
			});
			return p3.done();
		}).then((data:Array<crud.activity>)=>{
			if(data){
				this.setState({
					activities:data
				});
			}
		});
	}
	edit(event:any){
		let fields:compat.Map=this.fields;
		var element:any=event.target;
		var parent:any=element.parentNode.parentNode;
		if(element.getAttribute("data-save")=="false"){
			element.className="button circle icons x16 check white";
			parent.children[1].contentEditable=true;
			element.setAttribute("data-save","true");
			return;
		}
		var data:compat.Map={};
		data[parent.id]=fields[parent.id];
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:peoples.teachers)=>{
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
		this.state.activities=this.state.activities.filter((row)=>{
			if(row._id==data._id){
				return false;
			}
			return true;
    });
  	this.setState({
      	activities : this.state.activities
    });
	}
	changeGrade(event:any){
		var data={
			grade:event.target.value
		}
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/teachers/${this.props.routeParams.id}/grade/${data.grade}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:peoples.teachers)=>{
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
		var _switch:compat.Map={
			TEACHER: "Docente",
			teacher:"Alumno",
			PARENT:"Representante"
		};
		var role:string=_switch[this.state.teacher.data.mode];
		var Items=valid.map((row)=>{
			return (
				<div className="item" key={row.name} id={row.name}>
					<div className="field">
						<b>{row.label}:</b>
					</div>
					<div className="value" onKeyUp={(e:any)=>{this.getFields(e)}} onKeyDown={(e:any)=>{this.keycod(e)}}>
						{row.value}
					</div>
					<div className="toolbox">
						<button className="button circle icons x16 edit white" data-save={false} title="Editar campo" onClick={(e:any)=>{this.edit(e)}}></button>
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
						<select id="grade" onChange={(e:any)=>{this.changeGrade(e)}}>
							<option value="">Seleccione una opción</option>
							{
								this.state.grades.map((row)=>{
									if(!this.state.teacher.grade || row._id!=this.state.teacher.grade._id){
										return (<option key={row._id} value={row._id}>{row.name}</option>);

									}
									return (
										<option selected={true} key={row._id} value={row._id}>{row.name}</option>
									);
								})
							}
						</select>
					</div>
				</div>
				<h3>Actividades creadas :</h3>
				{this.state.teacher.grade && (
					<div className="flex row">
						<Link to={`/activities/${this.state.teacher.data.dni}/${this.state.teacher.grade.name}/create`} className="button circle icons x16 add white"></Link>
					</div>
				)}
				<TableActivities activities={this.state.activities} session={this.session} delete={this.deleteField.bind(this)}/>
			</div>
    	</div>
    );
  }
}
