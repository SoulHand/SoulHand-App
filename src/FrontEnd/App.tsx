import * as React from 'react';
import {hashHistory} from 'react-router';
import {NavBar} from './templates/NavBar';

export class App extends React.Component<{}, {}> {
	public temp="hola";
	componentDidMount(){
	}
	render () {
		return (
			<div>
				<NavBar></NavBar>
				{this.props.children}
	      	</div>
	    );	    
  	}
}
