import * as React from 'react';
import {getJSON, ajax} from 'jquery'
import {Link} from 'react-router';

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
	deleteField(event: any){
		var element:EventTarget=event.target;		
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/people/students/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
	Filter(event:any){
		var filter=this.students.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.data.name)==true || exp.test(row.data.dni)==true || (row.grade && exp.test(row.grade.name)==true)){
				return true;
			}
			return false;
		});
		this.setState({
	      	students : filter
	    });
	}
	componentDidMount(){
		getJSON(`${window.settings.uri}/v1/people/students/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
			this.students= data;
			this.setState({
		      students: data
		    });
		})
	}
	render () {
    return (
		<div className="container card">
			<div className="right">
				<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
			</div>
			<h3>Estudiante</h3>
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
					this.state.students.map((row:any)=>{
						console.log(row);
						return (
							<tr key={row._id}>
								<td>{row.data.dni}</td>
								<td><Link to={`/students/${row._id}`} className="title">{row.data.name}</Link></td>
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
		</div>
    );
  }
}
