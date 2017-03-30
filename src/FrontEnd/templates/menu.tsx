import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';
import 'jquery';
import 'tether';
import 'bootstrap';



export class menu extends React.Component<{}, {}> {
	render (){
		return(<div className="menu">
			<ul>
				<li><Link to="/">{item 1}</Link></li>
				<li><Link to="/">{item 2}</Link></li>
				<li><Link to="/">{item 3}</Link></li>
			</ul>
		</div>);
	}
}