import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {ajax} from 'jquery'
import {Link} from 'react-router';
import {withRouter} from 'react-router';

@withRouter
export class ProfileBox extends React.Component<Props.profilebox, {}> {
	destroy(event:any){
		event.preventDefault();
		localStorage.removeItem("session");
		this.props.callback();
		this.props.router.replace("/auth");
	}
	render (){
		return(
			<div className="sidebar-widget author-widget">
		        <div className="media">
	              <a className="media-left" href="#">
	                <img src="/images/user-login-icon-14.png" className="img-responsive"/>
	              </a>
	              <div className="media-body">
	                <div className="media-links">
	                   <a href="#" className="sidebar-menu-toggle">Ver mi perfil -</a> <a href="pages_login(alt).html" onClick={(e:any)=>{this.destroy(e)}}>Cerrar sesión</a>
	                </div>
	                <div className="media-author">{this.props.session.user.username}</div>
	              </div>
	            </div>
	  		</div>
		);
	}
}
