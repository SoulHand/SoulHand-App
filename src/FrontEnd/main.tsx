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
import {Parents} from './templates/Parents';
import {ListParent} from './templates/parents/ListParent';
import {Login} from './templates/Login';
import {UserCreate} from './templates/users/UserCreate';

import {ListTeachers} from './templates/teachers/ListTeachers';
import {TeacherCreate} from './templates/teachers/TeacherCreate';
import {TeacherView} from './templates/teachers/TeacherView';
import {Index} from './templates/home/Index';
import {ListStudent} from './templates/students/ListStudent';
import {StudentCreate} from './templates/students/StudentCreate';
/*import {PageRepresentative} from './templates/PageRepresentative';
import {PageRepresentativeCreate} from './templates/PageRepresentativeCreate';
import {PageUserCreate} from './templates/PageUserCreate';*/
import {Auth} from './Auth';

window.addEventListener("load",()=>{
	render((
	 	<Router history={hashHistory}>
		    <Route path="/" component={Home}>
		    	<IndexRoute component={Index}/>
		    </Route>
		    <Route path="/auth" component={Login}/>
		    <Route path="/teacher" component={Teachers} onEnter={Auth}>
		    	<IndexRoute component={ListTeachers}/>
		    	<Route path="create" component={TeacherCreate}/>
		    	<Route path=":id" component={TeacherView}/>
		    </Route>
		    <Route path="/students" component={Student} onEnter={Auth}>
		    	<IndexRoute component={ListStudent}/>
		    	<Route path="create" component={StudentCreate}/>
		    </Route>
		    <Route path="/users" component={Home}>
		    	<Route path="create" component={UserCreate}/>
		    </Route>
	  	</Router>
	  ), document.body
	);
});

/*
		    	<IndexRoute component={ListStudent}/>
	
		    <Route path="/parents" component={Parents}>
		    	<IndexRoute component={ListParent}/>
		    	<Route path="create" component={PageRepresentativeCreate}/>
		    </Route>
		    <Route path="/user" component={Parents}>
		    	<Route path="create" component={PageUserCreate}/>
		    </Route>
*/