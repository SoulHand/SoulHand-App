import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';
import {Link} from 'react-router';

export class TituloIndicador extends React.Component<{}, {}> {
	render (){
		return(<div className="sidebar">
					<span className="small text-align center">{titulo_indicador}</span>								
				</div>);
	}
}