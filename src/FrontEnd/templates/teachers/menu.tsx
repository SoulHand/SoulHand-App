import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import {ProfileBox} from "../profilebox"


export class Menu extends React.Component<props.menu, states.menu> {
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
						<Link to="/" activeClassName="active">Inicio</Link>
					</li>
					<li>
						<Link to="/teacher/create" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Crear Docente</Link>
					</li>
					<li>
						<Link to="/teacher" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Ver docentes</Link>
					</li>
				</ul>
			</div>
		);
	}
}