import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {ajax} from 'jquery'
import {Link} from 'react-router';

export class Item extends React.Component<Props.ItemUser, {icon:string}> {
	state:{icon:string}={
		icon:"user"
	}
	componentDidMount(){
		this.changeIcon();
	}
	changeIcon(){
				this.setState({
		      icon : (this.props.user.isAdmin !=true) ? "certified" : "user"
		    });
	}
	changeAdmin(){
		this.props.user.isAdmin=!(this.props.user.isAdmin);
		var data={isAdmin:(this.props.user.isAdmin) ? this.props.user.isAdmin : undefined};
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/users/root/${this.props.user._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        crossDomain:true,
	        success:(data:any)=>{
	        	this.changeIcon();
	        }
		});
	}
	deleteField(event: any){
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/users/${this.props.user._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:any)=>{
	        	this.props.delete(data);
	        }
		});
	}
	render (){
		return(
			<div className="item">
				<img src="/images/user-login-icon-14.png" alt="Perfil de usuario" className="rounded-circle" width="84" height="84"/>
	  			<div className="container-element text-align center">
	  				<Link to={`/users/get/${this.props.user._id}`} className="title">{this.props.user.username}</Link>
	  				<small>{this.props.user._id}</small>
	  			</div>
				<div className="toolbox">
					<button className={`button circle icons x16 ${this.state.icon} white`} data-id={this.props.user._id} onClick={(e:any)=>{this.changeAdmin()}}></button>
					{this.props.user.isAdmin==false && (
						<button className="button circle icons x16 delete white" data-id={this.props.user._id} onClick={(e:any)=>{this.deleteField(e)}}></button>
					)}
				</div>
			</div>
		);
	}
}
