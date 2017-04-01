import * as React from 'react';
import {hashHistory} from 'react-router';
import {Bar} from './bar';
import {Menu} from './home/menu';
//import {NavBar} from './templates/NavBar';

export class Home extends React.Component<{}, {}> {
	render () {
		return (
			<div className="content" data-app="soulhand-services" data-align="left">
				<div className="body">
						<section className="page">
							<Bar/>
							<div className="container-body">
								{this.props.children}
							</div>
						</section>
				</div>
				<Menu/>
			</div>
	    );	    
  	}
}
