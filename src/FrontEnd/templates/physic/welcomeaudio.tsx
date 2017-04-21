import * as React from 'react';
import {ajax} from 'jquery'
import {Link} from 'react-router'
import {withRouter} from 'react-router';

//@withRouter
export class WelcomeAudio extends React.Component<Props.StudentCreate, {}> {
	render () {
    return (
		<div className="container">
			<h1 className="title">Pruebas Auditivas</h1>
			<p>Las pruebas auditivas miden cuánto sonido podemos oír. Hay muchos tipos diferentes de pruebas; una clínica o un profesional sanitario le hará las pruebas más adecuadas para evaluar la audición. Los resultados de las pruebas auditivas pueden mostrarse en un gráfico llamado audiograma.</p>
			<div className="flex row">
				<Link to={`/students/get/${this.props.routeParams.id}/physic/sound/registry`} className="button btn btn-primary">Conozco la perdida de audición</Link>
				<Link to={`/students/get/${this.props.routeParams.id}/physic/sound/asistent`} className="button btn btn-primary">Ayudame a evaluar</Link>
			</div>
		</div>
    );
  }
}
