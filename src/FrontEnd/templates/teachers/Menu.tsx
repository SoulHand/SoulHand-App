import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';


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
					<Link to="/" activeClassName="active">Inicio</Link>
				</li>
				<li>
					<Link to="/teacher/create" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Crear Docente</Link>
				</li>
				<li>
					<Link to="/teacher" activeClassName="active" onClick={(e)=>{this.toogle(e)}}>Ver docentes</Link>
				</li>
			</ul>
		</div>);
	}
}