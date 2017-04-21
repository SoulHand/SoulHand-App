import * as React from 'react';
import {getJSON, ajax} from 'jquery'
import {Link} from 'react-router';

export class ListDomain extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public domain:any=[];
	state={
		domain:[],
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
	        url: `${window.settings.uri}/v1/learning/domain/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.domain=this.domain.filter(function(row:peoples.teachers){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	domain : this.domain
			    });
	        }
		});
	}
	Filter(event:any){
		var filter=this.domain.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.name)==true){
				return true;
			}
			return false;
		});
		this.setState({
	      	domain : filter
	    });
	}
	componentDidMount(){
		getJSON(`${window.settings.uri}/v1/learning/domain/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
			this.domain= data;
			this.setState({
		      domain: data
		    });
		})
	}
	render () {
    return (
		<div className="container card">
			<div className="right">
				<input type="text" className="form-control" placeholder="Buscar" onChange={(e:any)=>{this.Filter(e)}}/>
			</div>
			<h3>Dominio</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
                 		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.domain.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td><Link to={`/domain/get/${row._id}`} className="title">{row.name}</Link></td>
								<td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e:any)=>{this.deleteField(e)}}>Eliminar</button></td>
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
