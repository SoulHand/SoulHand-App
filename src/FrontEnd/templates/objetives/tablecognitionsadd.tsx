import * as React from 'react';
import {ajax} from 'jquery'
import {Link} from 'react-router'

export class TableCognitionsAdd extends React.Component<Props.tableaddcognitions, {}>{
	addObjetive(event: any){
		let id:string=event.target.getAttribute("data-id");
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/knowedge/${this.props.domain}/objetives/${this.props.level}/${this.props.objetive}/cognitions/${id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:any)=>{
	        	this.props.callback(id);
	        }
		});
	}
	render () {
		if(!this.props.cognitions || (this.props.cognitions && this.props.cognitions.length==0)){
			return (
				<span className="text-align center">No existen resultados</span>
			);
		}
		return (
			<table className="table table-striped">
			<thead>
			<tr>
			<th>Nombre</th>
			</tr>
			</thead>
			<tbody>
			{
				this.props.cognitions.map((row)=>{
					return (
						<tr key={row._id} title={row.description}>
						<td>{row.name}</td>
						<td><button type="button" className="btn btn-success" data-id={row._id} onClick={(e:any)=>{this.addObjetive(e)}}>Añadir</button></td>
						</tr>
					);
				})
			}
			</tbody>
			</table>
		);
  }
}
