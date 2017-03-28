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
import {PageStudent} from './templates/PageStudent';
import {PageStudentCreate} from './templates/PageStudentCreate';
import {PageRepresentative} from './templates/PageRepresentative';
import {PageRepresentativeCreate} from './templates/PageRepresentativeCreate';
import {PageUserCreate} from './templates/PageUserCreate';


window.addEventListener("load",()=>{
	render((
	 	<Router history={hashHistory}>
		    <Route path="/" component={App}>
		    	<IndexRoute component={PageIndex}/>
		    </Route>
		    <Route path="/auth" component={App}>
		    	<IndexRoute component={Login}/>
		    </Route>
		    <Route path="/teacher" component={App}>
		    	<IndexRoute component={PageTeacher}/>
		    	<Route path="create" component={PageTeacherCreate}/>
		    </Route>
		    <Route path="/student" component={App}>
		    	<IndexRoute component={PageStudent}/>
		    	<Route path="create" component={PageStudentCreate}/>
		    </Route>
		    <Route path="/representative" component={App}>
		    	<IndexRoute component={PageRepresentative}/>
		    	<Route path="create" component={PageRepresentativeCreate}/>
		    <Route path="/user" component={App}>
		    	<Route path="create" component={PageuserCreate}/>
		    </Route>
	  	</Router>
	  ), document.body
	);
});