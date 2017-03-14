import * as React from 'react';
import {ajax,getJSON} from 'jquery'
//import * as settings from "../settings"

export class PageTeacher extends React.Component<{}, {}> {
	componentDidMount(){
		getJSON(`//0.0.0:8080/v1/teachers/?token=`,function(data){
			console.log(data)
		})
	}
	render () {
    return (
		<div className="container card">
			<form className="navbar-form navbar-right">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar"/>
				</div>
			</form>
			<h3>Docente</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Apellido></th>
						<th>Email</th>
						<th>interprete</th>
						<th>Modificar/Eliminar</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th><h4></h4></th>
						<th><h4></h4></th>
						<th><h4></h4></th>
						<th><h4></h4></th>
						<th><button type="button" className="btn btn-warning">Editar</button>
						<button type="button" className="btn btn-danger">Eliminar</button></th>
					</tr>
				</tbody>
			</table>
		</div>
    );
  }
}
