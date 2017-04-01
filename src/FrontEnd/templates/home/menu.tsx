import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';
import {withRouter} from 'react-router';
import {ProfileBox} from "../profilebox"

@withRouter
export class Menu extends React.Component<props.basic, props.basic> {
	public parent:Element;
	public session:users.sessions;
	state={
		session:null
	}
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	componentDidMount(){
		this.parent=document.querySelector("div[data-app=\"soulhand-services\"]");
		let session=localStorage.getItem("session");

    	if(session){
	    	this.session=JSON.parse(session);
	    	this.setState({
				session:this.session
			});
    	}
	}
	destroy(){
		this.session=null;
		this.setState({
			session:this.session
		});
	}
	toogle(event:any){
		this.parent.classList.toggle("slider");
	}	
	render (){
		return(
			<div className="menu">
				{this.state.session && (<ProfileBox session={this.state.session} callback={(e)=>{this.destroy()}}/>)
				}
				<ul>
					<li>
						<Link to="/" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Inicio</Link>
					</li>
					{!this.state.session && (
						<li>
							<Link to="/auth" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Iniciar sesión</Link>
						</li>						
					)}
					{!this.state.session && (
						<li>
							<Link to="/users/create" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Registrarse</Link>
						</li>						
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
						<li>
							<Link to="/teacher" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Docentes</Link>
						</li>						
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
						<li>
							<Link to="/users" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Usuarios</Link>
						</li>						
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
					<li>
						<Link to="/parents" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Representantes</Link>
					</li>
					)}
					{this.state.session && this.state.session.user.people.mode=="TEACHER" && (
					<li>
						<Link to="/students" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Alumnos</Link>
					</li>
					)}
				</ul>
			</div>
		);
	}
}