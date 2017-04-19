import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'
import {Link} from 'react-router'


export class TableTeachers extends React.Component<Props.tableteacher, {}>{
	deleteField(event: any){
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/people/teachers/${event.target.dataset.id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:any)=>{
	        	this.props.delete(data);
	        }
		});
	}
	render () {
		if(!this.props.teachers || (this.props.teachers && this.props.teachers.length==0)){
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
                 		<th>grado asignado</th>
                  		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.props.teachers.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td>{row.data.dni}</td>
								<td><Link to={`/teacher/get/${row._id}`} className="title">{row.data.name}</Link></td>
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

