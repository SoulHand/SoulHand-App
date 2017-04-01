import * as React from 'react';
import {getJSON, ajax} from 'jquery'
//import * as settings from "../settings"

export class ListStudent extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public students:any=[];
	state={
		students:[],
		search:""
	};
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}	
	getFields(event:any){
		this.setState({
	      search : event.target.value
	    });
	}
	deleteField(event: any){
		var element:EventTarget=event.target;		
		ajax({
			method:"DELETE",
	        url: `//localhost:8080/v1/people/students/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.students=this.students.filter(function(row:peoples.teachers){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	students : this.students
			    });
	        }
		});
	}
	componentDidMount(){
		getJSON(`//0.0.0:8080/v1/people/students/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
			this.students= data;
			this.setState({
		      students: data
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
			<h3>Estudiante</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
                 		<th>Apellido</th>
                  		<th>Represetante</th>
                 		<th>Fecha de Nacimieto</th>
                  		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.students.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td>{row.data.name}</td>
								<td><button type="button" className="btn btn-warning">Editar</button>
								<button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
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
