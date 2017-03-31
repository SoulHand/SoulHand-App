import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {ajax} from 'jquery'
import {Link} from 'react-router';

export class Item extends React.Component<props.studentItem, {}> {
	deleteField(event: any){
		ajax({
			method:"DELETE",
	        url: `//localhost:8080/v1/people/students/${this.props.people._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
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
	  				<Link to={`/student/${this.props.people._id}`} className="title">{this.props.people.data.name}</Link>
	  				<small>{this.props.people.data.dni}</small>
	  			</div>
				<div className="toolbox">
					<button className="button circle icons x16 delete white" data-id={this.props.people._id} onClick={(e)=>{this.deleteField(e)}}></button>
				</div>
			</div>
		);
	}
}