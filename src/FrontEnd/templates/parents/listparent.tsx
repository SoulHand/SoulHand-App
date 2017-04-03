import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./Item"
//import * as settings from "../settings"

export class ListParent extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public data:any=[];
	state={
		parents:[],
		search:""
	};
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	deleteField(data: Array<peoples.parents>){
		this.data=this.data.filter(function(row:peoples.parents){
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	this.setState({
	      	teachers : this.data
	    });		
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/people/parents/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	console.log(data);
	        	this.data=data;
				this.setState({
			      parents : data
			    });
	        }
		});
	}
	Filter(event:any){
		var filter=this.data.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.data.name)==true || exp.test(row.data.dni)==true){
				return true;
			}
			return false;
		});
		this.setState({
	      	parents : filter
	    });
	}
	render(){
		let Parents = this.state.parents.map((row:peoples.parents) => {
	      return (
	        <Item people={row} key={row._id} session={this.session} delete={this.deleteField.bind(this)}/>
	      );
	    });
		return (
			<div className="container">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
				</div>
				<div className="fieldset" data-align="justify">
					{
						(this.state.parents.length>0) ?
							Parents
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
