import * as React from 'react';
import {getJSON} from 'jquery'
//import * as settings from "../settings"

export class PageTeacher extends React.Component<{}, {}> {
	public PrivateKeyId="d8a03b84-c5b7-48a2-876b-2e93aec1dd36";
	public PublicKeyId="NThjN2ZiZTQ3NTkxZDMwZTZiM2E4NDYz"
	public teachers:any=[];
	componentDidMount(){
		getJSON(`//0.0.0:8080/v1/teachers/?PublicKeyId=${this.PublicKeyId}&PrivateKeyId=${this.PrivateKeyId}`,(data)=>{
			this.teachers=data;
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
						<th>Nombre y Apellido</th>
						<th>Email</th>
						<th>interprete</th>
						<th>Modificar/Eliminar</th>
					</tr>
				</thead>
				<tbody>
				{
					this.teachers.forEach((row:any)=>{
						<tr>
							<td>{row.data.name}</td>
							<td>{row.data.email}</td>
							<td>{(row.interprete==true) ? 'Sí' : 'No'}</td>
							<td><button type="button" className="btn btn-warning">Editar</button>
							<button type="button" className="btn btn-danger">Eliminar</button></td>
						</tr>
					})
				}
				</tbody>
			</table>
		</div>
    );
  }
}
