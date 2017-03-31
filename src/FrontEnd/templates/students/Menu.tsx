import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';



export class Menu extends React.Component<{}, {}> {
	public parent:Element;
	componentDidMount(){
		this.parent=document.querySelector("div[data-app=\"soulhand-services\"]");
	}
	toogle(event:any){
		this.parent.classList.toggle("slider");
	}
	render (){
		return(<div className="menu">
			<ul>
				<li>
					<Link to="/" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Inicio</Link>
				</li>
				<li>
					<Link to="/students/create" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Crear alumno</Link>
				</li>
				<li>
					<Link to="/students" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Ver alumnos</Link>
				</li>
			</ul>
		</div>);
	}
}