import * as React from 'react';
import {ajax} from 'jquery'
import {Link} from 'react-router'

export class TableCognitions extends React.Component<{cognitions:Array<crud.cognition>}, {}>{
	render () {
		if(!this.props.cognitions || (this.props.cognitions && this.props.cognitions.length==0)){
			return (
				<span className="text-align center">No posee funciones cognitivas</span>
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
						<td><b>{row.name}</b></td>
						</tr>
					);
				})
			}
			</tbody>
			</table>
		);
  }
}
