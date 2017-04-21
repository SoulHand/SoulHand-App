import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';

export class DoncentesRegistrados extends React.Component<{}, {}> {
	render (){
		return(<div className="container">
					<h1 className="text-align center">Docentes registrados</h1>
					<div className="row align-items-center">
					    <div className="col">
							<button className=" button circle icons x16 add white" title="Añadir un docente"></button>
					    </div>
					    <div className="col col-lg-4">
							<input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Buscar">	</input>	
					    </div>
				  	</div>
				  	<div className="fieldset" data-align="justify">
				  		<div className="item">
				  			<img src="/images/1.jpg" alt="..." className="rounded-circle" width="84" height="84"></img>
				  			<div className="container-element text-align center">
				  				<Link to="#" className="title">{nombre_usuario}</Link>
				  				<small>{_id}</small>
				  			</div>
				  			<div className="toolbox">
				  				<button className="button circle icons x16 delete white"></button>
				  			</div>
				  		</div>
				  		<div className="item">
				  			<img src="/images/1.jpg" alt="..." className="rounded-circle" width="84" height="84"></img>
				  			<div className="container-element text-align center">
				  				<Link to="#" className="title">{nombre_usuario}</Link>
				  				<small>{_id}</small>
				  			</div>
				  			<div className="toolbox">
				  				<button className="button circle icons x16 delete white"></button>
				  			</div>
				  		</div>
				  	</div>
				</div>);
	}
}