import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import {ProfileBox} from "../profilebox"


export class Menu extends React.Component<{}, {}> {
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
	    	session=JSON.parse(session);
	    	this.setState({
				session:session
			});
    	}
	}
	toogle(event:any){
		this.parent.classList.toggle("slider");
	}
	render (){
		return(
			<div className="menu">
				{this.state.session && (<ProfileBox session={this.state.session}/>)
				}
				<ul>
					<li>
						<Link to="/" activeClassName="active">Inicio</Link>
					</li>
					<li>
						<Link to="/matter/create" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Crear Materia</Link>
					</li>
					<li>
						<Link to="/matter" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Ver Materia</Link>
					</li>
				</ul>
			</div>
		);
	}
}