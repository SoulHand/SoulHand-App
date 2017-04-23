import * as React from 'react';
import 'string-validator'
import {Link} from 'react-router'
import {ajax} from 'jquery'
import {LineChart} from '../linechart'

export class ActivitieView extends React.Component<Props.GenericRouter, states.ActivityView >{
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:compat.Map={};
	state: states.ActivityView = {
		activity:null,
		error:null,
		grades:[],
		objetives:[]
	};
	constructor(props:Props.GenericRouter) {
			super(props);
			let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
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
		var data:compat.Map={};
		data[parent.id]=this.fields[parent.id];
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/activity/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:crud.activity)=>{
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
	deleteField(event: any){
		var element:HTMLElement=event.target;
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/activities/${element.getAttribute("data-id")}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:crud.objetive)=>{
						this.state.objetives=this.state.objetives.filter(function(row){
							if(row._id==data._id){
								return false;
							}
							return true;
				    });
			    	this.setState({
				      	objetives : this.state.objetives
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
					<div className="value" onKeyUp={(e:any)=>{this.getFields(e)}} onKeyDown={(e:any)=>{this.keycod(e)}}>
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
				<Link to={`/activities/objetive/create/${this.state.activity._id}`} className="button circle icons x16 add white"></Link>
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
								<td><Link to={`/activities/get/${this.state.activity._id}/objetive/get/${row._id}`}>{row.name}</Link></td>
								<td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e:any)=>{this.deleteField(e)}}>Eliminar</button></td>
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
