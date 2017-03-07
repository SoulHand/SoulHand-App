import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import $ from 'jquery';
import 'tether';
import 'bootstrap';
import './scss/main.scss';
import {NavBar} from './templates/navbar.tsx';


			//<IndexRoute component={Desktop}/>
window.addEventListener("load",()=>{
	render((
	  <Router history={hashHistory}>
	    <Route path="/" component={NavBar}>
	    </Route>  	
	  </Router>
	  ), document.body
	);
});
