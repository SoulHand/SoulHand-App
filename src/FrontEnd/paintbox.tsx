import * as React from 'react';
import {Link} from 'react-router';

export class PaintBox extends React.Component<{}, {}> {    
  render () {
    return (
	<div id="paintbox" className="docks hiden" data-align="horizontal-bottom" data-transition="ease-out">
     	<ul>
            <li><a className="icon draw" id="drawFree" title="Dibujar a mano alzada" href="javascript:void(0);" draggable="false"></a></li>
            <li><a className="icon clear" id="clear" title="Borrador" href="javascript:void(0);" draggable="false"></a></li>            
            <li><a className="icon cancel" id="removePaint" title="Limpiar pantalla" href="javascript:void(0);" draggable="false"></a></li>            
            <li><a className="icon target" id="lineWeight" title="Tamaño de la línea" href="javascript:void(0);" draggable="false"></a></li>            
            <li><a className="icon fill" id="fillColor" title="Seleccionar color" href="javascript:void(0);" draggable="false"></a></li>            
            <li><a className="icon font" id="fontSize" title="Tamaño fuente" href="javascript:void(0);" draggable="false"></a></li>            
     	</ul>
    </div>
    );
  }
}
