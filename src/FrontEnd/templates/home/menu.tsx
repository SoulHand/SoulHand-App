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
export class Menu extends React.Component<Props.menu, states.menu> {
	public parent:Element;
	state:states.menu={
		session:null
	}
	constructor(props:Props.menu) {
		super(props);
			let str: string=localStorage.getItem("session");
	    	if(str){
					let session:users.sessions = JSON.parse(str);
		    	this.state.session=session;
	    	}
	}
	componentDidMount(){
		this.parent=document.querySelector("div[data-app=\"soulhand-services\"]");
	}
	destroy(){
		this.setState({
			session:null
		});
	}
	toogle(event:any){
		this.parent.classList.toggle("slider");
	}
	render (){
		return(
			<div className="menu">
				{this.state.session && (
					<ProfileBox session={this.state.session} callback={(e:any)=>{this.destroy()}}/>
					)
				}
				<ul>
					<li>
						<Link to="/" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Inicio</Link>
					</li>
					{!this.state.session && (
						<li>
							<Link to="/users/create" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Registrarse</Link>
						</li>
					)}
					{!this.state.session && (
						<li>
							<Link to="/auth" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Iniciar sesión</Link>
						</li>
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
						<li>
							<Link to="/teacher" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Docentes</Link>
						</li>
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
						<li>
							<Link to="/users" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Usuarios</Link>
						</li>
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
					<li>
						<Link to="/parents" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Representantes</Link>
					</li>
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
					<li>
						<Link to="/activities" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Actividades</Link>
					</li>
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
					<li>
						<Link to="/domain" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Dominio del aprendizaje</Link>
					</li>
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
					<li>
						<Link to="/matter" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Materias</Link>
					</li>
					)}
					{this.state.session && this.state.session.user.isAdmin==true && (
					<li>
						<Link to="/grades" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Grados</Link>
					</li>
					)}
					{this.state.session && this.state.session.user.people.mode=="TEACHER" && (
					<li>
						<Link to="/students" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Alumnos</Link>
					</li>
					)}
				</ul>
			</div>
		);
	}
}
