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
window.addEventListener("load",())=>{
	render((
	 <NavBar/>
	  ), document.body)}

onsubmit.addEventListener("submit",())=>{
	render((
	 <form/>
	  ), document.body)}

onreset.addEventListener("reset",())=>{
	render((
	 <form/>
	  ), document.body)}

onselect.addEventListener("select",())=>{
	render((
	 <body/>
	  ), document.body)}

onblur.addEventListener("reset",())=>{
	render((
	 <button/>
	 <input/> 
	 <label/> 
	 <select/> 
	 <textarea/> 
	 <body/>
	  ), document.body)}

onfocus.addEventListener("reset",())=>{
	render((
	 <button/>
	 <input/> 
	 <label/> 
	 <select/> 
	 <textarea/> 
	 <body/>
	  ), document.body)}


	);
});