import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';
import {App} from './App';

import {Home} from './templates/Home';
import {Teachers} from './templates/Teachers';
import {Student} from './templates/Student';
import {PageIndex} from './templates/PageIndex';
import {Login} from './templates/Login';
import {ListTeachers} from './templates/teachers/ListTeachers';
import {TeacherCreate} from './templates/teachers/TeacherCreate';
import {TeacherView} from './templates/teachers/TeacherView';
import {PageStudent} from './templates/PageStudent';
import {PageStudentCreate} from './templates/PageStudentCreate';
import {PageRepresentative} from './templates/PageRepresentative';
import {PageRepresentativeCreate} from './templates/PageRepresentativeCreate';
import {PageUserCreate} from './templates/PageUserCreate';
import {Auth} from './Auth';

window.addEventListener("load",()=>{
	render((
	 	<Router history={hashHistory}>
		    <Route path="/" component={Home}>
		    	<IndexRoute component={PageIndex}/>
		    </Route>
		    <Route path="/auth" component={Login}/>
		    <Route path="/teacher" component={Teachers} onEnter={Auth}>
		    	<IndexRoute component={ListTeachers}/>
		    	<Route path="create" component={TeacherCreate}/>
		    	<Route path=":id" component={TeacherView}/>
		    </Route>
		    <Route path="/students" component={Student} onEnter={Auth}>
		    	<IndexRoute component={PageStudent}/>
		    	<Route path="create" component={PageStudentCreate}/>
		    </Route>
		    <Route path="/representative" component={App}>
		    	<IndexRoute component={PageRepresentative}/>
		    	<Route path="create" component={PageRepresentativeCreate}/>
		    </Route>
		    <Route path="/user" component={App}>
		    	<Route path="create" component={PageUserCreate}/>
		    </Route>
	  	</Router>
	  ), document.body
	);
});