import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';
import {App} from './App';

import {Home} from './templates/Home';
import {Teachers} from './templates/Teachers';
import {Matter} from './templates/Matter';
import {Student} from './templates/Student';
import {PeriodSchools} from './templates/PeriodSchools';
import {KnowledgeLevel} from './templates/KnowledgeLevel';
import {Parents} from './templates/Parents';
import {ListParent} from './templates/parents/ListParent';

import {Login} from './templates/Login';
import {ListTeachers} from './templates/teachers/ListTeachers';
import {TeacherCreate} from './templates/teachers/TeacherCreate';
import {MatterCreate} from './templates/matter/MatterCreate';
import {PeriodSchoolsCreate} from './templates/PeriodSchools/PeriodSchoolsCreate';
import {KnowledgeLevelCreate} from './templates/KnowledgeLevel/KnowledgeLevelCreate';
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
		    <Route path="/" component={Home} onEnter={Auth}>
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
		    <Route path="/matter" component={Matter} onEnter={Auth}>
		    	<IndexRoute component={ListMatter}/>
		    	<Route path="create" component={MatterCreate}/>
		    </Route>
		     <Route path="/matter" component={PeriodSchools} onEnter={Auth}>
		    	<IndexRoute component={ListMatter}/>
		    	<Route path="create" component={PeriodSchoolsCreate}/>
		    </Route>
		     <Route path="/matter" component={KnowledgeLevel} onEnter={Auth}>
		    	<IndexRoute component={ListMatter}/>
		    	<Route path="create" component={KnowledgeLevelCreate}/>
		    </Route>
	  	</Router>
	  ), document.body
	);
});

/*
	
		    <Route path="/parents" component={Parents}>
		    	<IndexRoute component={ListParent}/>
		    	<Route path="create" component={PageRepresentativeCreate}/>
		    </Route>
		    <Route path="/user" component={Parents}>
		    	<Route path="create" component={PageUserCreate}/>
		    </Route>
*/