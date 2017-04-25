import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Step1 extends React.Component<Props.GenericRouter, {}> {
	render () {
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>Objetivos de aprendizaje</h1>
				<p className="text-align justify">Los objetivos de aprendizaje son un conjunto de conocimientos, aptitudes o conductas que los estudiantes deben aprender, comprender o ejecutar como resultado de un aprendizaje.</p>
				<p className="text-align justify">Es necesario que te enfoques en tus metas a futuro dentro del salon de clases y que deseas que tus alumnos adquieran durante su proceso de aprendizaje</p>
				<p><b>Te ayudaremos a crear un objetivo adecuado juntos</b></p>
				<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
				<Link to={`/objetive/create/${this.props.routeParams.domain}/${this.props.routeParams.level}/step2`} className="button btn-success">Continuar</Link>
			</div>
    );
  }
}
