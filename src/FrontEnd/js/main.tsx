//import "tether"
//import "boostrap"
import "./material"
import * as React from 'react'
import {render} from 'react-dom'
import {Route, Router, hashHistory, IndexRoute} from 'react-router'
import {App} from '../components/app'
import {DashBoard} from '../components/dashboard'

window.addEventListener("load",()=>{
  render((
	 	<Router history={hashHistory}>
		    <Route path="/" component={App}>
          <IndexRoute component={DashBoard}/>
		    </Route>
	  	</Router>
	  ), document.body);
});
