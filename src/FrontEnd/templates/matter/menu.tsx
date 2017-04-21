import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import {ProfileBox} from "../profilebox"


export class Menu extends React.Component<Props.menu, states.menu> {
	public parent:Element;
	public session:users.sessions;
	state:states.menu ={
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
	toogle(event:any){
		this.parent.classList.toggle("slider");
	}
	destroy(){
		this.setState({
			session:null
		});
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
