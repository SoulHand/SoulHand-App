import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';
import './scss/main.scss';
import {NavBar} from './templates/NavBar';


			//<IndexRoute component={Desktop}/>
/*
 <Router history={hashHistory}>
	    <Route path="/" component={NavBar}>
	    </Route>  	
	  </Router>
	  */
window.addEventListener("load",()=>{
	render((
	 <NavBar/>
	  ), document.body
	);
});