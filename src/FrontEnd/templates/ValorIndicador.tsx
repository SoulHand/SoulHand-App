import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import {render} from 'react-dom';

export class ValorIndicador extends React.Component<{}, {}> {
		render (){
			return(<div className="box-view">
						<h1 className="indication">{valor_indicador}</h1>					
					</div>);
		}
}