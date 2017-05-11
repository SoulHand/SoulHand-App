import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import 'jquery';
import 'tether';
import 'bootstrap';

import './settings';
import {Home} from './templates/home';
import {SetActivity} from './templates/setactivity';
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
import {WelcomeAudio} from './templates/physic/welcomeaudio';
import {RegistryAudio} from './templates/physic/registryaudio';
import {AsistAudio} from './templates/physic/asistaudio';
import {Several} from './templates/physic/several';
import {Glomery} from './templates/physic/glomery';
import {Trans} from './templates/physic/trans';
import {Convers} from './templates/physic/convers';
import {Silen} from './templates/physic/silen';
import {StudentCreate} from './templates/students/studentcreate';
import {StudentView} from './templates/students/studentview';

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
import {DomainObjetiveView} from './templates/domain/domainobjetiveview';
import {DomainObjetive} from './templates/domain/domainobjetive';

//import {Activities} from './templates/activities';
import {ActivitiesCreate} from './templates/activities/activitiescreate';
import {ActivitieView} from './templates/activities/activitieview';
import {setStudent} from './templates/activities/setstudent';
import {ObjetiveCreate} from './templates/objetives/objetivecreate';
import {ObjetiveView} from './templates/objetives/objetiveview';


import * as AsistObject from './templates/objetives/asistents/objetiveasist';
import * as Error from './templates/error';

//import {ListActivities} from './templates/activities/listactivities';

//import {Cognitive} from './templates/cognitive';
//import {ListCognitive} from './templates/cognitive/listcognitive';
//import {CognitiveCreate} from './templates/cognitive/cognitivecreate';
//import {CognitiveView} from './templates/cognitive/cognitiveview';

//import {Cognitive} from './templates/cognitive';
//import {ListCognitive} from './templates/cognitive/listcognitive';
//import {CognitiveView} from './templates/cognitive/cognitiveview';

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
		    <Route path="/auth" component={Login}/>
		    <Route path="/teacher" component={Teachers} onEnter={Auth}>
		    	<IndexRoute component={ListTeachers}/>
		    	<Route path="create" component={TeacherCreate}/>
		    	<Route path="get/:id" component={TeacherView}/>
		    </Route>
		    <Route path="/students" component={Student} onEnter={Auth}>
		    	<IndexRoute component={ListStudent}/>
		    	<Route path="get/:id" component={StudentView}/>
		    	<Route path="get/:id/physic/create" component={PhysicCreate}/>
		    	<Route path="get/:id/physic/sound" component={WelcomeAudio} />
		    	<Route path="get/:id/physic/sound/registry" component={RegistryAudio}/>
		    	<Route path="get/:id/physic/sound/asistent" component={AsistAudio}/>
		    	<Route path="get/:id/physic/sound/asistent/step2" component={Several}/>
		    	<Route path="get/:id/physic/sound/asistent/step3" component={Trans}/>
		    	<Route path="get/:id/physic/sound/asistent/step4" component={Glomery}/>
		    	<Route path="get/:id/physic/sound/asistent/step5" component={Convers}/>
		    	<Route path="get/:id/physic/sound/asistent/step6" component={Silen}/>
		    	<Route path="create/:id" component={StudentCreate}/>
		    </Route>
		    <Route path="/grades" component={Grades} onEnter={Auth}>
		    	<IndexRoute component={ListGrade}/>
		    	<Route path="get/:id" component={GradeView}/>
		    	<Route path="create" component={GradeCreate}/>
		    </Route>
		    <Route path="/set" component={SetActivity} onEnter={Auth}>
		    	<Route path="activities/:id/students" component={setStudent}/>
		    </Route>
		    <Route path="/parents" component={Parents} onEnter={Auth}>
		    	<IndexRoute component={ListParent}/>
		    	<Route path="get/:id" component={ParentView}/>
		    	<Route path="create" component={ParentsCreate}/>
		    </Route>
		    <Route path="/domain" component={Domain} onEnter={Auth}>
		    	<IndexRoute component={ListDomain}/>
		    	<Route path="get/:id" component={DomainView}/>
		    	<Route path="get/:domain/objetive/:level" component={DomainObjetiveView}/>
		    	<Route path="get/objetive/:objetive" component={ObjetiveView}/>
		    	<Route path="create" component={DomainCreate}/>
		    </Route>
		    <Route path="/users" component={Home}>
		    	<IndexRoute component={ListUsers} onEnter={Auth}/>
		    	<Route path="get/:id" component={UserView}/>
		    	<Route path="create" component={UserCreate}/>
		    </Route>
		    <Route path="/matter" component={Matter} onEnter={Auth}>
		    	<IndexRoute component={ListMatter}/>
		    	<Route path="get/:id" component={MatterView}/>
		    	<Route path="create" component={MatterCreate}/>
		    </Route>
				<Route path="/activities" component={Teachers} onEnter={Auth}>
					<Route path=":id/:grade/create" component={ActivitiesCreate}/>
					<Route path="get/:id" component={ActivitieView}/>
					<Route path="get/:id/objetive/get/:objetive" component={ActivitieView}/>
					<Route path="objetive/create/:activity" component={ObjetiveCreate}/>
				</Route>
				<Route path="/objetive/create" component={AsistObject.Asist} onEnter={Auth}>
					<Route path="step1" component={AsistObject.step1}/>
					<Route path="step2" component={AsistObject.step2}/>
					<Route path="step3/:objetive" component={AsistObject.step3}/>
				</Route>
				<Route path="/error" onEnter={Auth}>
					<Route path="resolve" component={Error.Objectives.Asist}>
						<Route path="objetive/:objetive/cognition/step1" component={Error.Objectives.Page.Step1}/>
						<Route path="objetive/:objetive/cognition/step2" component={Error.Objectives.Page.Step2}/>
					</Route>
				</Route>
	  	</Router>
	  ), document.body
	);
});
/*
	Para Despues

	<Route path="/activities" component={Teachers} onEnter={Auth}>
		<Route path=":id/:grade/create" component={ActivitiesCreate}/>
		<Route path="objetive/create/:id" component={ObjetiveCreate}/>
	</Route>
	<Route path="/cognitive" component={Cognitive} onEnter={Auth}>
	 <IndexRoute component={ListCognitive}/>
	 <Route path="create" component={CognitiveCreate}/>
 </Route>
*/






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
