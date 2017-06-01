import "../vendor/material.min.js"
import * as React from 'react'
import {render} from 'react-dom'
import {Route, Router, hashHistory, IndexRoute} from 'react-router'
import {App} from '../components/app'
import {DashBoard} from '../components/dashboard'
import {Login} from '../components/login'
import * as Teacher from '../components/teacher'
import * as Parent from '../components/parent'
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
        <Route path="/parents" onEnter={Auth}>
          <IndexRoute component={Parent.Parent}/>
          <Route path="get/:id" component={Parent.Get}/>
          <Route path="edit/:id" component={Parent.Modify}/>
          <Route path="create" component={Parent.Add}/>
        </Route>
        <Route path="/auth" component={Login}/>
	  	</Router>
	  ), document.getElementById("app"));
});
