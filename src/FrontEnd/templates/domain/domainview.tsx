import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {Link} from 'react-router'

export class DomainView extends React.Component<Props.GenericRouter, states.DomainView> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:compat.Map={};
	public domain:crud.domain;
	state: states.DomainView = {
		domain:null,
		error:null
	};
	constructor(props:Props.GenericRouter) {
			super(props);
			let str: string=localStorage.getItem("session");
	    	if(str){
					let session:users.sessions = JSON.parse(str);
		    	this.session=session;
	    	}
	}
	public getFields(event:any){
		var element=event.target.parentNode;
		this.fields[element.id]=event.target.innerText || event.target.textContent;
	}
	keycod(event:any){
		var element=event.target;
		if(event.keyCode==13){
			event.preventDefault();
			element.parentNode.children[2].children[0].click();
		}
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/learning/domain/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:crud.domain)=>{
	        	this.domain=data;
			    this.setState({
			      domain : data
			    });
	        }
		});
	}
	edit(event:any){
		var element=event.target;
		var parent=element.parentNode.parentNode;
		if(element.dataset.save=="false"){
			element.className="button circle icons x16 check white";
			parent.children[1].contentEditable=true;
			element.setAttribute("data-save","true");
			return;
		}
		var data:compat.Map={};
		data[parent.id]=this.fields[parent.id];
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/learning/domain/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:crud.domain)=>{
						element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
						element.setAttribute("data-save","false");
	        	this.setState({
							domain:data
						});
	        },
	        error:(data:any)=>{
	        	this.setState({
					error:data.responseJSON.message
				});
	        }
		});
	}
	deleteField(event: any){
		var element:HTMLElement=event.target;
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/learning/domain/${element.getAttribute("data-id")}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.domain.cognitions=this.domain.cognitions.filter(function(row:crud.cognition){
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
		var filter=this.domain.cognitions.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.name)==true){
				return true;
			}
			return false;
		});
		var data=JSON.parse(JSON.stringify(this.domain));
		data.cognitions=filter;
		this.setState({
	      	domain : data
	    });
	}
	render () {
		if(!this.state.domain){
			return (
    			<div className="container">
    			{this.state.error && (
					<div className="alert alert-danger" role="alert">
					  {this.state.error}
					</div>
				)}
    				<div className="loadding"></div>
    			</div>
			);
		}
    return (
    	<div className="container">
			{this.state.error && (
				<div className="alert alert-danger" role="alert">
				  {this.state.error}
				</div>
			)}
			<div className="fieldset">
				<div className="item" id="name">
					<div className="field"></div>
					<div className="value" onKeyUp={(e:any)=>{this.getFields(e)}} onKeyDown={(e:any)=>{this.keycod(e)}}>{this.state.domain.name}</div>
					<div className="toolbox">
						<button className="button circle icons x16 edit white" data-save={false} title="Editar campo" onClick={(e:any)=>{this.edit(e)}}></button>
					</div>
				</div>
			</div>
			<h3>Funciones cognitivas</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
                 		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.domain.cognitions.map((row:crud.cognition)=>{
						return (
							<tr key={row._id}>
								<td><b>{row.name}</b></td>
								<td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e:any)=>{this.deleteField(e)}}>Eliminar</button></td>
							</tr>
						);
					})
				}
				</tbody>
			</table>
			<h3>Niveles de aprendizaje</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nivel</th>
						<th>Nombre</th>
            <th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.domain.levels.map((row:crud.level)=>{
						return (
							<tr key={row._id}>
								<td>{row.level}</td>
								<td><Link to={`/domain/get/${this.state.domain.name}/objetive/${row.name}`}>{row.name}</Link></td>
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
