import * as React from 'react';
import {getJSON, ajax} from 'jquery'
//import * as settings from "../settings"

export class ListType extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public type:any=[];
	state={
		type:[],
		search:""
	};
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	deleteField(event: any){
		var element:EventTarget=event.target;		
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/learning/type/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.type=this.type.filter(function(row:peoples.teachers){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	type : this.type
			    });
	        }
		});
	}
	componentDidMount(){
		getJSON(`//0.0.0:8080/v1/learning/type/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
			this.type= data;
			this.setState({
		      type: data
		    });
		})
	}
	render () {
    return (
		<div className="container card">
			<form className="navbar-form navbar-right">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar"/>
				</div>
				<span>{this.state.search}</span>
			</form>
			<h3>Tipo de aprendizaje</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
                 		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.type.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td>{row.name}</td>
								<td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
							</tr>
						);
					})
				}
				</tbody>
			</table>
		</div>
    );
  }
}
