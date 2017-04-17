import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';

import './settings';
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
import {PhysicCreate} from './templates/physic/physiccreate';
import {StudentCreate} from './templates/students/studentcreate';
import {StudentView} from './templates/students/studentview';

import {PeriodSchools} from './templates/periodschools';
import {ListPeriodSchools} from './templates/periodschools/listperiodschools';
import {PeriodSchoolsCreate} from './templates/periodschools/periodschoolscreate';
import {PeriodSchoolView} from './templates/periodschools/periodschoolsview';

import {KnowedgeLevel} from './templates/knowedgelevel';
import {ListKnowedgeLevel} from './templates/knowedgelevel/listknowedgelevel';
import {KnowedgeLevelCreate} from './templates/knowedgelevel/knowedgelevelcreate';

import {Parents} from './templates/parents';
import {ListParent} from './templates/parents/listparent';
import {ParentsCreate} from './templates/parents/parentscreate';
import {ParentView} from './templates/parents/parentview';

import {Grades} from './templates/grades';
import {GradeCreate} from './templates/grades/gradecreate';
import {ListGrade} from './templates/grades/listgrade';
import {GradeView} from './templates/grades/gradeview';

import {Users} from './templates/users';
import {UserCreate} from './templates/users/usercreate';
import {ListUsers} from './templates/users/listuser';
import {UserView} from './templates/users/userview';

import {Domain} from './templates/domain';
import {DomainCreate} from './templates/domain/domaincreate';
import {ListDomain} from './templates/domain/listdomain';
import {DomainView} from './templates/domain/domainview';

import {Type} from './templates/type';
import {ListType} from './templates/type/listype';
import {TypeCreate} from './templates/type/typecreate';
import {TypeView} from './templates/type/typeview';

import {CongnitiveFunctions} from './templates/congnitive';
import {ListCongnitive} from './templates/congnitive/listcongnitive';
import {CongnitiveCreate} from './templates/congnitive/congnitivecreate';
import {CongnitiveView} from './templates/congnitive/typeview';
import {Login} from './templates/login';

/*import {PageRepresentative} from './templates/PageRepresentative';
import {PageRepresentativeCreate} from './templates/PageRepresentativeCreate';
import {PageUserCreate} from './templates/PageUserCreate';*/
import {Auth} from './auth';

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
		    	<Route path="get/:id" component={StudentView}/>
		    	<Route path="get/:id/physic/create" component={PhysicCreate}/>
		    	<Route path="create/:id" component={StudentCreate}/>
		    </Route>
		    <Route path="/grades" component={Grades} onEnter={Auth}>
		    	<IndexRoute component={ListGrade}/>
		    	<Route path=":id" component={GradeView}/>
		    	<Route path="create" component={GradeCreate}/>
		    </Route>
		    <Route path="/parents" component={Parents} onEnter={Auth}>
		    	<IndexRoute component={ListParent}/>
		    	<Route path="get/:id" component={ParentView}/>
		    	<Route path="create" component={ParentsCreate}/>
		    </Route>
		    <Route path="/domain" component={Domain} onEnter={Auth}>
		    	<IndexRoute component={ListDomain}/>
		    	<Route path=":id" component={DomainView}/>
		    	<Route path="create" component={DomainCreate}/>
		    </Route>
		    <Route path="/type" component={Type} onEnter={Auth}>
		    	<IndexRoute component={ListType}/>
		    	<Route path="create" component={TypeCreate}/>
		    </Route>
		    <Route path="/users" component={Home}>
		    	<IndexRoute component={ListUsers} onEnter={Auth}/>
		    	<Route path=":id" component={UserView}/>
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
		     <Route path="/knowedge" component={KnowedgeLevel} onEnter={Auth}>
		    	<IndexRoute component={ListKnowedgeLevel}/>
		    	<Route path="create" component={KnowedgeLevelCreate}/>
		    </Route>
		     <Route path="/congnitive" component={Congnitive} onEnter={Auth}>
		    	<IndexRoute component={ListCongnitive}/>
		    	<Route path="create" component={CongnitiveCreate}/>
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