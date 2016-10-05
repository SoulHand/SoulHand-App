import * as React from 'react';
import {Link} from 'react-router';

export class ToolDock extends React.Component<{}, {}> {
    componentDidMount(){
      console.log('Mount');
    }
  render () {
    return (
	<div id="toolbox" className="docks hiden" data-align="vertical-left" data-transition="ease-out">
     	<ul>
            <li><a className="icon paint" id="paint" title="Panel de dibujo" href="javascript:void(0);" draggable="false"></a></li>
            <li><a className="icon keygen" id="login" title="Ver mi perfil" href="javascript:void(0);" draggable="false"></a></li>            
     	</ul>
    </div>
    );
  }
}
