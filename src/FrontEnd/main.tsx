import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';

import {Home} from './templates/home';
import {Index} from './templates/home/index';

import {Teachers} from './templates/teachers';
import {ListTeachers} from './templates/teachers/listteachers';
import {TeacherCreate} from './templates/teachers/teachercreate';
import {TeacherView} from './templates/teachers/teacherview';

import {Matter} from './templates/matter';
import {MatterCreate} from './templates/matter/mattercreate';
import {ListMatter} from './templates/matter/listmatter';
import {MatterView} from './templates/matter/matterview';

import {Student} from './templates/students';
import {ListStudent} from './templates/students/liststudents';
import {StudentCreate} from './templates/students/studentcreate';
import {StudentView} from './templates/students/studentview';

import {ListPeriodSchools} from './templates/periodschools/listperiodschools';


import {PeriodSchools} from './templates/periodschools';
import {KnowedgeLevel} from './templates/knowedgelevel';
import {Parents} from './templates/Parents';
import {Grades} from './templates/Grades';
import {Users} from './templates/Users';
import {Domain} from './templates/Domain';
import {Type} from './templates/Type';
import {ListParent} from './templates/parents/ListParent';
import {Login} from './templates/Login';
import {UserCreate} from './templates/users/UserCreate';
import {ListUsers} from './templates/users/ListUsers';

import {PeriodSchoolsCreate} from './templates/periodschools/periodschoolscreate';
import {ListKnowledgeLevel} from './templates/knowedgelevel/listknowedgelevel';
import {KnowledgeLevelCreate} from './templates/knowedgelevel/knowedgelevelcreate';
import {GradeCreate} from './templates/grades/GradeCreate';
import {ListGrade} from './templates/grades/ListGrade';
import {DomainCreate} from './templates/domain/DomainCreate';
import {ListDomain} from './templates/domain/ListDomain';
import {TypeCreate} from './templates/type/TypeCreate';
import {ListType} from './templates/type/ListType';
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
		    <Route path="/users" component={Users}>
		    	<IndexRoute component={ListUsers} onEnter={Auth}/>
		    <Route path="/type" component={Type} onEnter={Auth}>
		    	<IndexRoute component={ListType}/>
		    	<Route path="create" component={TypeCreate}/>
		    </Route>
		    <Route path="/users" component={Home}>
		    	<Route path="create" component={UserCreate}/>
		    </Route>
		    <Route path="/matter" component={Matter} onEnter={Auth}>
		    	<IndexRoute component={ListMatter}/>
		    	<Route path=":id" component={MatterView}/>
		    	<Route path="create" component={MatterCreate}/>
		    </Route>
		     <Route path="/periodschools" component={PeriodSchools} onEnter={Auth}>
		    	<IndexRoute component={ListPeriodSchools}/>
		    	<Route path="create" component={PeriodSchoolsCreate}/>
		    </Route>
		     <Route path="/knowledgelevel" component={KnowedgeLevel} onEnter={Auth}>
		    	<IndexRoute component={ListKnowledgeLevel}/>
		    	<Route path="create" component={KnowledgeLevelCreate}/>
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