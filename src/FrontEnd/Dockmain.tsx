import * as React from 'react';
import {Link} from 'react-router';

export class MainDock extends React.Component<{}, {}> { 
  render () {
    return (
	<div id="mainbox" className="docks hiden" data-align="vertical-right" data-transition="ease-out">
     	<ul>
            <li><a className="icon import" id="importFile" title="Cargar archivo" href="javascript:void(0);" draggable="false"></a></li>
            <li><a className="icon capture" id="capture" title="Activar camara" href="javascript:void(0);" draggable="false"></a></li>
            <li><a className="icon camera" id="camera" title="Captura de pantalla" href="javascript:void(0);" draggable="false"></a></li>
            <li><a className="icon big" id="big" title="Activar pantalla completa" href="javascript:void(0);" draggable="false"></a></li>
     		<li><a className="icon config" id="config" title="Menú de Configuraciones" href="javascript:void(0);" draggable="false"></a></li>
     	</ul>
    </div>
    );
  }
}
