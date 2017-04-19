import * as React from 'react';
import * as validator from 'string-validator'
import {Link} from 'react-router'
import {ReactHighcharts} from 'react-highcharts'
import {ajax} from 'jquery'
import {LineChart} from '../linechart'

export class ActivitieView extends React.Component<props.usersItem, props.stateUser {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	state = {
		activity:null,
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
	        url: `${window.settings.uri}/v1/activities/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}).done((data:any)=>{
			this.setState({
		      activity:data	      
		    });
		    //activitys.profile
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
	        url: `${window.settings.uri}/v1/people/activity/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:activitys.profile)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
					activity:data
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
		if(!this.state.activity){
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
				name:"name",
				label:"Nombre",
				value:this.state.activity.name
			},
			{
				name:"description",
				label:"Descripción",
				value:this.state.activity.description
			},
			{
				name:"dateExpire",
				label:"Expira en",
				value:this.state.activity.dateExpire
			},
			{
				name:"course.name",
				label:"Materia",
				value:this.state.activity.course.name
			},
			{
				name:"dateCreated",
				label:"Creado en",
				value:this.state.activity.dateCreated
			},
			{
				name:"isCompleted",
				label:"Estado",
				value:(this.state.activity.isCompleted==true) ? "COMPLETADO" : "NO COMPLETADO"
			}
		];		
		var Items=valid.map((row)=>{
			return (
				<div className="item" key={row.name} id={row.name}>
					<div className="field">
						<b>{row.label}:</b>									
					</div>
					<div className="value" onKeyUp={(e)=>{this.getFields(e)}} onKeyDown={(e)=>{this.keycod(e)}}>
						{row.value}
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
			</div>	
			<h3 className="text-align center">Objetivos de aprendizaje</h3>			
			<div className="flex row">
				<Link to={`/activitys/get/${this.props.routeParams.id}/physic/create`} className="button circle icons x16 add white"></Link>
			</div>			
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.activity.objetives.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td><Link to={``}>{row.name}</Link></td>
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

