import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./item"
import {TableTeachers} from "./tableteachers"
//import * as settings from "../settings"

export class ListTeachers extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public teachers:any=[];
	state={
		teachers:[],
		search:""
	};
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	deleteField(data: any){
		this.teachers=this.teachers.filter(function(row:peoples.teachers){
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	this.setState({
	      	teachers : this.teachers
	    });
	}
	Filter(event:any){
		var filter=this.teachers.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.data.name)==true || exp.test(row.data.dni)==true || (row.grade && exp.test(row.grade.name)==true)){
				return true;
			}
			return false;
		});
		this.setState({
	      	teachers : filter
	    });
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:peoples.teachers)=>{
	        	this.teachers=data;
				this.setState({
			      teachers : data
			    });
	        }
		});
	}
	render(){		
		return (
			<div className="container card">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
				</div>
				<h3>Docentes</h3>
				<TableTeachers teachers={this.state.teachers} session={this.session} delete={this.deleteField.bind(this)}/>			
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
