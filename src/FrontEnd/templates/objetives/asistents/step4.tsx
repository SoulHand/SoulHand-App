import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Step4 extends React.Component<Props.GenericRouter, {}> {
	render () {
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>!Es hora de evaluar!</h1>
				<p className="text-align justify">Para hacer mas adaptable el esfuerzo de evaluación te ayudaremos a crear indicadores que sean utiles basado en las objetivos cognoscitivos que desarrollan los seres humanos.</p>
				<p className="text-align justify"><b>A continuación te propongo una serie de objetivos cognoscitivos recomendados para tus alumnos</b></p>
				<div className="flex column align-items-stretch">
					<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
					<Link to={`/objetive/create/step5/${this.props.routeParams.objetive}`} className="button btn-success">Continuar</Link>
				</div>
			</div>
    );
  }
}
