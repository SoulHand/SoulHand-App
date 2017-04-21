import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';

export class AnadirDocente extends React.Component<{}, {}> {
	render (){
		return(<div className="col">
							<button className=" button circle icons x16 add white" title="Añadir un docente"></button>
			   </div>);
	}
}