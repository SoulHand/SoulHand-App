import * as React from 'react';
import {hashHistory} from 'react-router';
import {NavBar} from './templates/NavBar';

export class App extends React.Component<{}, {}> {
	componentDidMount(){
		let session=localStorage.getItem("session");
		if(!session){			
			hashHistory.push('/auth')
		}
		this.setState({
			user:JSON.parse(session)
		})
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
