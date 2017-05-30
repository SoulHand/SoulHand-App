//import "tether"
//import "boostrap"
import "./material"
import * as React from 'react'
import {render} from 'react-dom'
import {Route, Router, hashHistory, IndexRoute} from 'react-router'
import {App} from '../components/app'
import {DashBoard} from '../components/dashboard'
import {Login} from '../components/login'
import * as Teacher from '../components/teacher'
import {Auth} from './auth'

window.addEventListener("load",()=>{
  render((
	 	<Router history={hashHistory}>
		    <Route path="/" component={App} onEnter={Auth}>
          <IndexRoute component={DashBoard}/>
		    </Route>
        <Route path="/teachers" component={Teacher.Teacher} onEnter={Auth}>
          <IndexRoute component={Teacher.Teachers}/>
        </Route>
        <Route path="/teachers/create" component={Teacher.Add} onEnter={Auth}/>
        <Route path="/auth" component={Login}/>
	  	</Router>
	  ), document.body);
});
