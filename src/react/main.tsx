import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {App} from './App';
import {Desktop} from './Desktop';
window.addEventListener("load",()=>{
	let app=document.getElementById("app");
	let video=document.createElement("video");
	let canvas=document.createElement("canvas").getContext("2d");
	canvas.canvas.width=_CONFIG.ouput.width;
	canvas.canvas.height=_CONFIG.ouput.height;
	video.addEventListener("canplay",()=>{
        JVision.parent.setAttribute("data-playing","true");
    });
    JVision.init(video,canvas);
	render((
	  <Router history={hashHistory}>
	    <Route path="/" component={App}>
			<IndexRoute component={Desktop}/>
	    </Route>  	
	  </Router>
	  ), app
	);
});
