import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./Item"
//import * as settings from "../settings"

export class ListTeachers extends React.Component<{}, {}> {
	public PrivateKeyId="1dec3409-dbc9-4314-8bb4-a38ef808c702";
	public PublicKeyId="NThjODg5ZWIxMjA3OTIwYTcwY2E2NDkz";
	public session:users.sessions;
	public data:any=[];
	public state:any
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
		this.state = {teachers:[],search:""};
    	session=JSON.parse(session);
		this.session=session;
	}
	deleteField(data: any){
		this.data=this.data.filter(function(row:peoples.teachers){
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	console.log(this);
    	this.setState({
	      	teachers : this.data
	    });
		/*ajax({
			method:"DELETE",
	        url: `//localhost:8080/v1/people/teachers/${event.target.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:any)=>{
	        	this.data=this.data.filter(function(row){
					if(row._id==data._id){
						return false;
					}
					return true;
	        	})
	        }
		});*/
	}
	getFields(event:any){
		this.setState({
	      search : event.target.value
	    });
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	this.data=data;
				this.setState({
			      teachers : data
			    });
	        }
		});
	}
	render(){
		let teachers = this.state.teachers.map((row:peoples.teachers) => {
	      return (
	        <Item people={row} key={row._id} session={this.session} delete={this.deleteField.bind(this)}/>
	      );
	    });
		return (
			<div className="container">
				<div className="fieldset" data-align="justify">
					{
						(this.state.teachers.length>0) ?
							teachers
						:
							<span className="text-align center">No existen resultados</span>
					}
				</div>
			</div>
		);
	}
	/*render () {
		let teachers = this.state.teachers.map((row:any) => {
	      return (
	        <tr key={row._id}>
				<td>{row.data.name}</td>
				<td>{row.data.email}</td>
				<td>{(row.interprete==true) ? 'Sí' : 'No'}</td>
				<td><button type="button" className="btn btn-warning">Editar</button>
				<button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
			</tr>
	      );
	    });
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
					{
						(!this.state.teachers) ?
							<tr>
								<td colSpan={4}>
									<span className="align-center">No se encuentran resultados</span>
								</td>
							</tr>
						:
							teachers
					}
				</tbody>
			</table>
		</div>
    );
  }*/
}
