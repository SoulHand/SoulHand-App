import * as React from 'react';
import {ajax} from 'jquery'
import 'string-validator'
import {withRouter, Link} from 'react-router';

@withRouter
export class Step1 extends React.Component<Props.GenericRouter, {}> {
	render () {
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>No tengo una solución</h1>
				<p>Lo sentimos no se pudo generar un resultado, seria util que nos ayude a generar una respuesta</p>
				<p>Puedes ayudar a solucionar estos problemas proporcionando tu conocimiento.</p>
				<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Omitir</button>
				<Link to={`/error/resolve/objetive/${this.props.routeParams.objetive}/cognition/step2`} className="button btn-success">Continuar</Link>
			</div>
    );
  }
}
