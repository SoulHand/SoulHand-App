import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';
import 'bootstrap/scss/bootstrap.scss';
import './scss/main.scss';
import './scss/pingendo.css';
import {App} from './App';
import {PageIndex} from './templates/PageIndex';
import {Login} from './templates/Login';
import {PageTeacher} from './templates/PageTeacher';
import {PageTeacherCreate} from './templates/PageTeacherCreate';
import {Auth} from './Auth';

window.addEventListener("load",()=>{
	render((
	 	<Router history={hashHistory}>
		    <Route path="/" component={App}>
		    	<IndexRoute component={PageIndex}/>
		    </Route>
		    <Route path="/auth" component={App}>
		    	<IndexRoute component={Login}/>
		    </Route>
		    <Route path="/teacher" component={App} onEnter={Auth}>
		    	<IndexRoute component={PageTeacher}/>
		    	<Route path="create" component={PageTeacherCreate}/>
		    </Route>
	  	</Router>
	  ), document.body
	);
});