import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';

export class Buscar extends React.Component<{}, {}> {
	render(){
		return(<div className="col col-lg-4">
					<input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Buscar"/>		
			   </div>);
	}
}