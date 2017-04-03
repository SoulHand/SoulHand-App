import * as React from 'react';
import {getJSON, ajax} from 'jquery'
import {Link} from 'react-router';

//import * as settings from "../settings"

export class ListGrade extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public grades:any=[];
	state={
		grades:[],
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
	        url: `${window.settings.uri}/v1/grades/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.grades=this.grades.filter(function(row:peoples.teachers){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	grades : this.grades
			    });
	        }
		});
	}
	componentDidMount(){
		getJSON(`//0.0.0:8080/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
			console.log(data);
			this.grades= data;
			this.setState({
		      grades: data
		    });
		})
	}	
	Filter(event:any){
		var filter=this.grades.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.name)==true){
				return true;
			}
			return false;
		});
		this.setState({
	      	grades : filter
	    });
	}
	render () {
    return (
		<div className="container card">
			<div className="right">
				<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
			</div>
			<h3>Grado</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
                 		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.grades.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td><Link to={`/grades/${row._id}`} className="title">{row.name}</Link></td>
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
