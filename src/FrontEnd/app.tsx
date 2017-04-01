import * as React from 'react';
import {hashHistory} from 'react-router';
import {Bar} from './templates/Bar';
import {Menu} from './templates/Menu';
//import {NavBar} from './templates/NavBar';

export class App extends React.Component<{}, {}> {
	public temp="hola";
	componentDidMount(){
	}
	render () {
		return (
			<div className="content" data-app="soulhand-services" data-align="left">
				<div className="body">
						<section className="page">
							<Bar/>
							<div className="container-body">
								<div className="container">
									{this.props.children}
								</div>
							</div>
						</section>
				</div>
				<Menu/>
			</div>
	    );	    
  	}
}
