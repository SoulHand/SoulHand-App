import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {App} from './App';
import {Desktop} from './Desktop';
import JVision = require('../../bower_components/ciweb/min/JVision.js');
window.addEventListener("load",()=>{
	var app=document.getElementById("app");
	render((
	  <Router history={hashHistory}>
	    <Route path="/" component={App}>
			<IndexRoute component={Desktop}/>
	    </Route>  	
	  </Router>
	  ), app
	);
});
