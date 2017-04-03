import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {Link} from 'react-router';


export class TableStudents extends React.Component<props.studentItem, {}>{
	deleteField(event: any){
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/people/students/${event.target.dataset.id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:any)=>{
	        	this.props.delete(data);
	        }
		});
	}
	render () {
		if(!this.props.students){
			return (
				<span className="text-align center">No existen resultados</span>
			);
		}
		return (
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Cedula Escolar</th>
						<th>Nombre y Apellido</th>
                  		<th>Escala perdida de audición</th>
                 		<th>grados</th>
                  		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.props.students.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td>{row.data.dni}</td>
								<td><Link to={`/students/get/${row._id}`} className="title">{row.data.name}</Link></td>
								<td>{(row.discapacityLevel==0) ?
									"NO EVALUADA"
									:  (row.discapacityLevel>25 && row.discapacityLevel<=40) ?
										"LEVE"
									: (row.discapacityLevel>40 && row.discapacityLevel<=70) ?
										"MODERADA"
									: (row.discapacityLevel>70 && row.discapacityLevel<=90) ?
										"SEVERA"
									: (row.discapacityLevel>90 && row.discapacityLevel<=120) ?
										"PROFUNDA"
									:
										"SIN PERDIDA"
								}</td>
								<td>{(row.grade) ? row.grade.name : "NO ASIGNADO"}</td>
								<td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
							</tr>
						);
					})
				}
				</tbody>
			</table>
		);		
  }	
}

