import * as React from 'react';
import {Link} from 'react-router';

export class PlayBox extends React.Component<{}, {}> {   
  render () {
    return (
	<div id="playcall" className="docks hiden" data-align="horizontal-bottom-right" data-transition="ease-out">
     	<ul>
            <li><a className="icon play" id="boxPlay" title="Reproducir" href="javascript:void(0);" draggable="false"></a></li>
            <li><a className="icon stop" id="stop" title="Detener" href="javascript:void(0);" draggable="false"></a></li>            
            <li><a className="icon sound" id="sound" title="Desactivar sonido" href="javascript:void(0);" draggable="false"></a></li>            
            <li><a className="icon hand" id="hand" title="Mano.Arrastre hacia la imagen!" href="javascript:void(0);" draggable="true"></a></li>            
            <li><a className="icon profile" id="profile" title="Rostro.Arrastre hacia la imagen!" href="javascript:void(0);" draggable="true"></a></li>            
            <li><a className="icon eje" id="notrack" title="Falso Positivo.Arrastre hacia la imagen!" href="javascript:void(0);" draggable="true"></a></li>            
     	</ul>
    </div>
    );
  }
}
