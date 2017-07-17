import "../vendor/material.min.js"
import "../vendor/material.min.js"
import * as React from 'react'
import {render} from 'react-dom'
import {Route, Router, hashHistory, IndexRoute} from 'react-router'
import {App} from '../components/app'
import {DashBoard} from '../components/dashboard'
import {Login} from '../components/login'
import * as Teacher from '../components/teacher'
import * as Student from '../components/student'
import * as Parent from '../components/parent'
import * as Grade from '../components/grades'
import * as Matters from '../components/matters'
import * as Domain from '../components/domain'
import * as Activity from '../components/activities'
import {UserCreate} from '../components/users/usercreate'
import {CognitionCreate} from '../components/objetive/cognitioncreate'
import {Auth} from './auth'

window.addEventListener("load",()=>{
  render((
	 	<Router history={hashHistory}>
		    <Route path="/" component={App} onEnter={Auth}>
          <IndexRoute component={DashBoard}/>
		    </Route>
        <Route path="/teachers" onEnter={Auth}>
          <IndexRoute component={Teacher.Teacher}/>
          <Route path="get/:id" component={Teacher.Get}/>
          <Route path="edit/:id" component={Teacher.Modify}/>
          <Route path="grade/edit/:id" component={Teacher.Grade}/>
          <Route path="create" component={Teacher.Add}/>
        </Route>
        <Route path="/students" onEnter={Auth}>
          <IndexRoute component={Student.Student}/>
          <Route path="get/:id" component={Student.Get}/>
          <Route path="get/:id/physic" component={Student.Physic.Physic}/>
          <Route path="get/:id/physic/create" component={Student.Physic.Create}/>
          <Route path="get/:id/objetives" component={Student.Activity.ViewObjetive}/>
          <Route path="edit/:id" component={Student.Modify}/>
          <Route path="grade/edit/:id" component={Student.Grade}/>
          <Route path="create/:id" component={Student.Add}/>
        </Route>
        <Route path="/parents" onEnter={Auth}>
          <IndexRoute component={Parent.Parent}/>
          <Route path="get/:id" component={Parent.Get}/>
          <Route path="edit/:id" component={Parent.Modify}/>
          <Route path="create" component={Parent.Add}/>
        </Route>
        <Route path="/grades" onEnter={Auth}>
          <IndexRoute component={Grade.Grade}/>
          <Route path="get/:id" component={Grade.Get}/>
          <Route path="edit/:id" component={Grade.Modify}/>
          <Route path="create" component={Grade.Add}/>
        </Route>
        <Route path="/matters" onEnter={Auth}>
          <IndexRoute component={Matters.Matter}/>
          <Route path="get/:id" component={Matters.Get}/>
          <Route path="edit/:id" component={Matters.Modify}/>
          <Route path="create" component={Matters.Add}/>
        </Route>
        <Route path="/domains" onEnter={Auth}>
          <IndexRoute component={Domain.Domain}/>
          <Route path="get/:id" component={Domain.Get}/>
          <Route path=":domain/objetives/:level" component={Domain.Objetive}/>
        </Route>
        <Route path="/objetives" onEnter={Auth}>
          <Route path="get/:id" component={Domain.Cognition}/>
          <Route path="get/:id/cognition" component={CognitionCreate}/>
          <Route path="create/:activity" component={Activity.setObjetive}/>
          <Route path="create" component={Domain.Add}/>
        </Route>
        <Route path="/activity" onEnter={Auth}>
          <IndexRoute component={Activity.Activity}/>
          <Route path="get/:id" component={Activity.Get}/>
          <Route path="get/:activity/student/:student" component={Student.Activity.View}/>
          <Route path="get/:activity/student/:student/complete/:objetive" component={Student.Activity.Completed}/>
          <Route path="create" component={Activity.Add}/>
          <Route path=":domain/objetives/:level" component={Domain.Objetive}/>
          <Route path="set/:activity/student" component={Activity.setStudent}/>
        </Route>
        <Route path="/auth" component={Login}/>
        <Route path="/registry" component={UserCreate}/>
	  	</Router>
	  ), document.getElementById("app"));
});
