import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'

export class UserView extends React.Component<props.usersItem, props.stateUser {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	state = {
		user:null,
		error:null,
		icon:"user"
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
	changeAdmin(){
		var data={isAdmin:(!this.state.user.isAdmin) ? true : undefined};
		console.log(data);
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/users/root/${this.state.user._id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        crossDomain:true,
	        success:(data:any)=>{
				this.setState({
			      user : data
			    });
	        	this.state.user=data;
	        }
		});
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/users/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:users.profile)=>{
	        	console.log(data);
			    this.setState({
			      user : data
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
	        url: `${window.settings.uri}/v1/users/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:users.profile)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
					user:data
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
		if(!this.state.user){
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
				value:this.state.user.people.dni
			},
			{
				name:"name",
				label:"Nombre y Apellido",
				value:this.state.user.people.name
			},
			{
				name:"birthdate",
				label:"Fecha de nacimiento",
				value:this.state.user.people.birthdate
			}
		];
		var role=({
			TEACHER: "Docente",
			STUDENT:"Alumno",
			PARENT:"Representante"
		})[this.state.user.people.mode];
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
		var iconAdmin=(this.state.user.isAdmin==true) ? "user" : "certified";
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
				<div className="right_side">
					<div className="fieldset">
						<div className="item" id="username">
							<div className="field"></div>
							<div className="value" onKeyUp={(e:any)=>{this.getFields(e)}} onKeyDown={(e:any)=>{this.keycod(e)}}>{this.state.user.username}</div>
							<div className="toolbox">
								<button className="button circle icons x16 edit white" data-save={false} title="Editar campo" onClick={(e:any)=>{this.edit(e)}}></button>
							</div>
						</div>						
					</div>
					<p className="text-align small">{this.state.user._id}</p>
				</div>
			</div>
			<div className="fieldset v-align middle">
				{Items}
				<div className="item">
					<div className="field">
						<b>rol:</b>									
					</div>
					<div className="value">
						{role}
					</div>
				</div>
				<div className="item">
					<div className="field">
						<b>tipo de cuenta:</b>									
					</div>
					<div className="value">
						{(this.state.user.isAdmin==true) ? 'GESTOR DEL CONOCIMIENTO' : 'USUARIO'}
					</div>
					<div className="tool">
						<button className={`button circle icons x16 ${iconAdmin} white`} data-id={this.state.user._id} onClick={(e:any)=>{this.changeAdmin(e)}}></button>
					</div>
				</div>
				<div className="item">
					<div className="field">
						<b>Creado en:</b>									
					</div>
					<div className="value">
						{this.state.user.dateCreated}
					</div>
				</div>
			</div>				
    	</div>		
    );
  }	
}