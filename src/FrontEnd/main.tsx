import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';
import {App} from './App';
import {PageIndex} from './templates/PageIndex';
import {Login} from './templates/Login';
import {PageTeacher} from './templates/PageTeacher';
import {PageTeacherCreate} from './templates/PageTeacherCreate';
import {Auth} from './Auth';

window.addEventListener("load",()=>{
	var body=document.querySelector("div[data-app=\"soulhand-services\"]");
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
	  ), body
	);
});