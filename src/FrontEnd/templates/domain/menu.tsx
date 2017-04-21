import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import {ProfileBox} from "../profilebox"
import {withRouter} from 'react-router';

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
					<li>
						<Link to="/domain/create" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Crear dominio</Link>
					</li>
					<li>
						<Link to="/domain" activeClassName="active" onClick={(e:any)=>{this.toogle(e)}}>Ver dominio</Link>
					</li>
				</ul>
			</div>
		);
	}
}
