import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {ajax} from 'jquery'
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';

export class Item extends React.Component<props.teacherItem, {}> {
	deleteField(event: any){
		ajax({
			method:"DELETE",
	        url: `//localhost:8080/v1/people/teachers/${this.props.people._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
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
				<img src="/images/1.jpg" alt="..." className="rounded-circle" width="84" height="84"/>
	  			<div className="container-element text-align center">
	  				<a href="#" className="title">{this.props.people.data.name}</a>
	  				<small>{this.props.people.data.dni}</small>
	  			</div>
				<div className="toolbox">
					<button className="button circle icons x16 delete white" data-id={this.props.people._id} onClick={(e)=>{this.deleteField(e)}}></button>
				</div>
			</div>
		);
	}
}