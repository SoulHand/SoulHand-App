import * as React from 'react';
import * as validator from 'string-validator'
import {Link} from 'react-router'
import Highcharts from 'highcharts/highstock'
import {ajax} from 'jquery'


export class StudentView extends React.Component<props.usersItem, props.stateUser {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	state = {
		student:null,
		error:null,
		grades:[]
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
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:students.profile)=>{
	        	console.log(data);
			    this.setState({
			      student : data
			    });
	        }
		});
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:students.profile)=>{
	        	console.log(data);
			    this.setState({
			      grades: data
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
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:students.profile)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
					student:data
				});
	        },
	        error:(data:any)=>{
	        	this.setState({
					error:data.responseJSON.message
				});
	        }
		});
	}
	changeGrade(event:any){
		var data={
			grade:event.target.value
		}
		console.log(data);
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:students.profile)=>{				
	        	this.setState({
					student:data
				});
	        },
	        error:(data:any)=>{
	        	this.setState({
					error:data.responseJSON.message
				});
	        }
		});
	}
	deleteField(event: any){
		var element:EventTarget=event.target;		
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}/physic/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{	        	
		    	this.setState({
					student:data
				});
	        }
		});
	}
	render () {
		if(!this.state.student){
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
				value:this.state.student.data.dni
			},
			{
				name:"name",
				label:"Nombre y Apellido",
				value:this.state.student.data.name
			},
			{
				name:"birthdate",
				label:"Fecha de nacimiento",
				value:this.state.student.data.birthdate
			}
		];
		var role=({
			TEACHER: "Docente",
			STUDENT:"Alumno",
			PARENT:"Representante"
		})[this.state.student.data.mode];
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
		var iconAdmin=(this.state.student.isAdmin==true) ? "student" : "certified";
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
						<b>Escalar perdida de audición:</b>						
					</div>
					<div className="value">
						<Link to={`/students/get/${this.props.routeParams.id}/physic/sound`}>							
						{(this.state.student.discapacityLevel==0) ?
							"NO EVALUADA"
							:  (this.state.student.discapacityLevel>25 && this.state.student.discapacityLevel<=40) ?
								"LEVE"
							: (this.state.student.discapacityLevel>40 && this.state.student.discapacityLevel<=70) ?
								"MODERADA"
							: (this.state.student.discapacityLevel>70 && this.state.student.discapacityLevel<=90) ?
								"SEVERA"
							: (this.state.student.discapacityLevel>90 && this.state.student.discapacityLevel<=120) ?
								"PROFUNDA"
							:
								"SIN PERDIDA"
						}
						</Link>
					</div>
				</div>
				<div className="item">
					<div className="field">
						<b>Creado en:</b>									
					</div>
					<div className="value">
						{this.state.student.data.createDate}
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
									if(this.state.student.grade && row._id==this.state.student.grade._id){
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
			</div>	
			<h3>Desarrollo físico</h3>
			<div className="flex row">
				<Link to={`/students/get/${this.props.routeParams.id}/physic/create`} className="button circle icons x16 add white"></Link>
			</div>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Fecha del registro</th>
						<th>Peso</th>
                  		<th>Estatura</th>
                  		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.student.physics.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td>{row.date}</td>
								<td>{row.weight} kg</td>
								<td>{row.height} cm</td>
								<td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
							</tr>
						);
					})
				}
				</tbody>
			</table>

    	</div>		
    );
  }	
}