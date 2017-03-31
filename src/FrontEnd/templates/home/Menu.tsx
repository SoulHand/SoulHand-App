import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';
import {withRouter} from 'react-router';

@withRouter
export class Menu extends React.Component<{}, {}> {
	public parent:Element;
	constructor(props:any) {
		super(props);    	
		this.state = {
			session:null
		};
	}
	componentDidMount(){
		this.parent=document.querySelector("div[data-app=\"soulhand-services\"]");
		let session=localStorage.getItem("session");

    	if(session){
	    	session=JSON.parse(session);
	    	this.setState({
				session:session
			});
    	}
	}
	toogle(event:any){
		this.parent.classList.toggle("slider");
	}
	destroy(event:any){
		event.preventDefault();
		this.toogle(event);
		localStorage.removeItem("session");
		this.props.router.replace("/auth");
	}
	render (){
		return(<div className="menu">
			<ul>
				<li>
					<Link to="/" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Inicio</Link>
				</li>
				<li>
					<Link to="/teacher" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Docentes</Link>
				</li>
				<li>
					<Link to="/students" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Alumnos</Link>
				</li>
				{ 
					this.state.session && (
						<li>
							<a href="#" onClick={(e)=>{this.destroy(e)}}>cerrar sesión</a>
						</li>						
					)
				}
			</ul>
		</div>);
	}
}