import * as React from 'react';
import {getJSON} from 'jquery'
//import * as settings from "../settings"

export class ListMatter extends React.Component<{}, {}> {
	public PrivateKeyId="1dec3409-dbc9-4314-8bb4-a38ef808c702";
	public PublicKeyId="NThjODg5ZWIxMjA3OTIwYTcwY2E2NDkz"
	constructor(props:any) {
		super(props);
		this.state = {student:[],search:""};
	}	
	getFields(event:any){
		this.setState({
	      search : event.target.value
	    });
	}
	componentDidMount(){//direccion
		getJSON(`//0.0.0:8080/v1/courses/?PublicKeyId=${this.PublicKeyId}&PrivateKeyId=${this.PrivateKeyId}`,(data)=>{
			this.setState({
		      student : data
		    });
		})
	}
	render () {
    return (
		<div className="container card">
			<form className="navbar-form navbar-right">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.getFields(e)}}/>
				</div>
				<span>{this.state.search}</span>
			</form>
			<h3>Materia</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
                   		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.student.forEach((row:any)=>{
						<tr>
							<td>{row.data.name}</td>
							<td><button type="button" className="btn btn-warning">Editar</button>
							<button type="button" className="btn btn-danger">Eliminar</button></td>
						</tr>	})
				}
				</tbody>
			</table>
		</div>
    );
  }
}
