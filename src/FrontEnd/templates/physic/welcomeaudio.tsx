import * as React from 'react';
import {ajax} from 'jquery'
import {Link} from 'react-router'
import {withRouter} from 'react-router';

//@withRouter
export class WelcomeAudio extends React.Component<Props.StudentCreate, {}> {
	render () {
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>Pruebas Auditivas</h1>
				<p className="text-align justify">Las pruebas auditivas miden cuánto sonido podemos oír. Hay muchos tipos diferentes de pruebas; una clínica o un profesional sanitario le hará las pruebas más adecuadas para evaluar la audición. Los resultados de las pruebas auditivas pueden mostrarse en un gráfico llamado audiograma.</p>
				<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
				<Link to={`/students/get/${this.props.routeParams.id}/physic/sound/registry`} className="button btn-success">Poseo los resultados</Link>
				<Link to={`/students/get/${this.props.routeParams.id}/physic/sound/asistent`} className="button btn-success">Continuar</Link>
			</div>
    );
  }
}
