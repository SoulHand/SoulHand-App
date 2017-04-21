import * as React from 'react';
import 'string-validator'
import {Link} from 'react-router'
import {ajax} from 'jquery'

export class DomainObjetiveView extends React.Component<Props.GenericRouter, states.DomainObjetiveView> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:compat.Map={};
	public objetive:crud.objetive;
	state: states.DomainObjetiveView = {
		objetive:null,
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
	        url: `${window.settings.uri}/v1/knowedge/${this.props.routeParams.domain}/objetives/${this.props.routeParams.level}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:crud.objetive)=>{
	        	this.objetive=data;
				    this.setState({
				      objetive : data
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
	        success:(data:crud.objetive)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
							objetive:data
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
	        	this.objetive.cognitions=this.objetive.cognitions.filter(function(row:crud.cognition){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	objetive : this.objetive
			    });
	        }
		});
	}
	Filter(event:any){
		var filter=this.objetive.cognitions.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.name)==true){
				return true;
			}
			return false;
		});
		var data:crud.objetive=JSON.parse(JSON.stringify(this.objetive));
		data.cognitions=filter;
		this.setState({
	      	objetive : data
	    });
	}
	render () {
    return (
    	<div className="container">
			{this.state.error && (
				<div className="alert alert-danger" role="alert">
				  {this.state.error}
				</div>
			)}
			<h3>Objetivos de aprendizajes</h3>
			<div className="flex row">
			  <Link to={`/students/get/${this.props.routeParams.id}/physic/create`} className="button circle icons x16 add white"></Link>
			</div>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Nombre</th>
            <th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.objetive.cognitions.map((row)=>{
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
    	</div>
    );
  }
}
