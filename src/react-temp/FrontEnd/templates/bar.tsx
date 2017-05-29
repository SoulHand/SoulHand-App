import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';

export class Bar extends React.Component<{}, {}> {
	public title:string="SoulHand";
	public parent:Element;
	componentDidMount(){
		this.parent=document.querySelector("div[data-app=\"soulhand-services\"]");
	}
	inShow(event:any){
		this.parent.classList.toggle("slider");
	}
	render () {
    return (<div className="bar metro gray">				
				<div className="center_side">
				<label className="label">{this.title}</label>
				</div>
				<div className="right_side">
          			<button type="button" className="navbar-toggle icon-bar" onClick={(e:any)=>{this.inShow(e)}}>
          				<span className="icon-bar"></span>
          				<span className="icon-bar"></span>
          				<span className="icon-bar"></span>
          			</button>
				</div>
			</div>);
	}
}