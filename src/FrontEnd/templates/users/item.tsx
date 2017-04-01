import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {ajax} from 'jquery'
import {Link} from 'react-router';

export class Item extends React.Component<props.teacherItem, {}> {
	state={
		icon:"user"
	}
	componentDidMount(){
		this.changeIcon();
	}
	changeIcon(){
			this.setState({
		      icon : (this.props.people.isAdmin !=true) ? "certified" : "user"
		    });
	}
	changeAdmin(){
		this.props.people.isAdmin=!(this.props.people.isAdmin);
		var data={isAdmin:(this.props.people.isAdmin) ? this.props.people.isAdmin : undefined};
		ajax({
			method:"PUT",
	        url: `//localhost:8080/v1/users/root/${this.props.people._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
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
	        url: `//localhost:8080/v1/users/${this.props.people._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
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
	  				<Link to={`/users/${this.props.people._id}`} className="title">{this.props.people.username}</Link>
	  				<small>{this.props.people._id}</small>
	  			</div>
				<div className="toolbox">
					<button className={`button circle icons x16 ${this.state.icon} white`} data-id={this.props.people._id} onClick={(e)=>{this.changeAdmin(e)}}></button>
					{this.props.people.isAdmin==false && (
						<button className="button circle icons x16 delete white" data-id={this.props.people._id} onClick={(e)=>{this.deleteField(e)}}></button>
					)}
				</div>
			</div>
		);
	}
}