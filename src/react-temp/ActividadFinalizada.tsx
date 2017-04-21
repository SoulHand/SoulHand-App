import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';

export class ActividadesFinalizar extends React.Component<{}, {}> {
	render(){
		return(<div className="layout">
					<h2>Actividades por finalizar</h2>
					<div className="fieldset" data-align="around">
						<div className="item">
							<div className="container-element text-align center">
								<Link to="/">{nombre_actividad}</Link>
								<small>{descripcion_corta}</small>
							</div>
							<div className="toolbox">
								<button className="button circle icons x16 check white"></button>
								<button className="button circle icons x16 check black"></button>					
							</div>
						</div>
					</div>
				</div>);
	}
}