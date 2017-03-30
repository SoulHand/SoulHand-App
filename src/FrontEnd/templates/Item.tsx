import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';

export class Item extends React.Component<{}, {}> {
	render (){
		return(<div className="item">
					<div className="container-element text-align center">
						<Link to="#">{nombre_actividad}</Link>
						<small>{descripcion_corta}</small>
				</div>
				<div>
					<button className="button circle icons x16 check white"></button>
					<button className="button circle icons x16 check black"></button>					
				</div>
				</div>);
	}
}