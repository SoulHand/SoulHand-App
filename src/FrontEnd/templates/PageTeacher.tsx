import * as React from 'react';
import {getJSON} from 'jquery'
//import * as settings from "../settings"

export class PageTeacher extends React.Component<{}, {}> {
	public PrivateKeyId="1dec3409-dbc9-4314-8bb4-a38ef808c702";
	public PublicKeyId="NThjODg5ZWIxMjA3OTIwYTcwY2E2NDkz"
	constructor(props:any) {
		super(props);
		this.state = {teachers:[],search:""};
	}	
	getFields(event:any){
		this.setState({
	      search : event.target.value
	    });
	}
	componentDidMount(){
		getJSON(`//0.0.0:8080/v1/people/teachers/?PublicKeyId=${this.PublicKeyId}&PrivateKeyId=${this.PrivateKeyId}`,(data)=>{
			this.setState({
		      teachers : data
		    });
		})
	}
	render () {
		var rows=(teachers:any):any=>{
			return (
				<tr>
					<td colSpan={4}>
						<span className="align-center">No se encuentran resultados</span>
					</td>
				</tr>
			);
		};
		if(this.state.teachers.length>0){
			rows= (teachers:any):any=>{
				return (
					<tbody>
						{
							teachers.forEach((row:any)=>{
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
				);
			};
		}
    return (
		<div className="container card">
			<form className="navbar-form navbar-right">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.getFields(e)}}/>
				</div>
				<span>{this.state.search}</span>
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
				{rows(this.state.teachers)}
				</tbody>
			</table>
		</div>
    );
  }
}
