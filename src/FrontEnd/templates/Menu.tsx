import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';



export class Menu extends React.Component<{}, {}> {
	render (){
		return(<div className="menu">
			<ul>
				<li>
					<Link to="/" activeClassName="active">Docente</Link>
				</li>
				<li>
					<Link to="/" activeClassName="active">Alumnos</Link>
				</li>
				<li>
					<Link to="/" activeClassName="active">Iniciar sesión</Link>
				</li>
			</ul>
		</div>);
	}
}