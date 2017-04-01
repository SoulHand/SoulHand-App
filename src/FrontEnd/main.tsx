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
import {Grades} from './templates/Grades';
import {Domain} from './templates/Domain';
import {ListParent} from './templates/parents/ListParent';
import {Login} from './templates/Login';
import {UserCreate} from './templates/users/UserCreate';

import {ListTeachers} from './templates/teachers/ListTeachers';
import {TeacherCreate} from './templates/teachers/TeacherCreate';
import {TeacherView} from './templates/teachers/TeacherView';
import {Index} from './templates/home/Index';
import {GradeCreate} from './templates/grades/GradeCreate';
import {ListGrade} from './templates/grades/ListGrade';
import {StudentCreate} from './templates/students/StudentCreate';
import {ListStudent} from './templates/students/ListStudent';
import {DomainCreate} from './templates/domain/DomainCreate';
import {ListDomain} from './templates/domain/ListDomain';
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
		    <Route path="/auth" component={Home}>
		    	<IndexRoute component={Login}/>		    
		    </Route>
		    <Route path="/teacher" component={Teachers} onEnter={Auth}>
		    	<IndexRoute component={ListTeachers}/>
		    	<Route path="create" component={TeacherCreate}/>
		    	<Route path=":id" component={TeacherView}/>
		    </Route>
		    <Route path="/students" component={Student} onEnter={Auth}>
		    	<IndexRoute component={ListStudent}/>
		    	<Route path="create" component={StudentCreate}/>
		    </Route>
		    <Route path="/grades" component={Grades} onEnter={Auth}>
		    	<IndexRoute component={ListGrade}/>
		    	<Route path="create" component={GradeCreate}/>
		    </Route>
		    <Route path="/domain" component={Domain} onEnter={Auth}>
		    	<IndexRoute component={ListDomain}/>
		    	<Route path="create" component={DomainCreate}/>
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