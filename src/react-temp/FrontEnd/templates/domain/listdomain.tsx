import * as React from 'react';
import {getJSON, ajax} from 'jquery'
import {Link} from 'react-router';

export class ListDomain extends React.Component<Props.GenericRouter, states.DomainList> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public domain:Array<crud.domain>=[];
	state:states.DomainList={
		domains:[],
		search:""
	};
	constructor(props:Props.GenericRouter) {
		super(props);
			let str: string=localStorage.getItem("session");
	    	if(str){
					let session:users.sessions = JSON.parse(str);
		    	this.session=session;
	    	}
	}
	deleteField(event: any){
		var element:HTMLElement=event.target;
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/learning/domain/${element.getAttribute("data-id")}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:crud.domain)=>{
	        	this.domain=this.domain.filter(function(row){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	domains : this.domain
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
      	domains : filter
    });
	}
	componentDidMount(){
		getJSON(`${window.settings.uri}/v1/learning/domain/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data:Array<crud.domain>)=>{
			this.domain= data;
			this.setState({
		      domains: data
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
					this.state.domains.map((row:any)=>{
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
