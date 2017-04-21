import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';

export class PanelFlex extends React.Component<{}, {}> {
	render () {
		return (<div className="panel flex row">
						<div className="box text-align center">
							<div className="box-view">
								<h1 className="indication">{valor_indicador}</h1>					
							</div>
							<div className="sidebar">
								<span className="small text-align center">{titulo_indicador}</span>								
							</div>
						</div>
						<div className="box text-align center">
							<div className="box-view">
								<h1 className="indication">{valor_indicador}</h1>					
							</div>
							<div className="sidebar">
								<span className="small text-align center">{titulo_indicador}</span>								
							</div>
						</div>						
					</div>);
	}

	}
