import * as React from 'react';
import {ajax} from 'jquery'
import {Link} from 'react-router'


export class TableActivities extends React.Component<Props.tableactivities, {}>{
	deleteField(event: any){
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/activities/${event.target.dataset.id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:any)=>{
	        	this.props.delete(data);
	        }
		});
	}
	render () {
		if(!this.props.activities || (this.props.activities && this.props.activities.length==0)){
			return (
				<span className="text-align center">No existen resultados</span>
			);
		}
		return (
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Expira</th>
                 		<th>Materia</th>
                 		<th>Estado</th>
                  		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.props.activities.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td><Link to={`/activities/get/${row._id}`}>{row.name}</Link></td>
								<td>{row.dateExpire}</td>
								<td>{row.course.name}</td>
								<td>{(row.isCompleted==true) ? "COMPLETADO" : "NO COMPLETADO"}</td>
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
