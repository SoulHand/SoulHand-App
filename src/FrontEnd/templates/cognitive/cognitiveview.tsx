import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'


export class CognitiveView extends React.Component<props.usersItem, props.stateUser {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	public cognitive:crud.cognitive;
	state = {
		cognitive:null,
		error:null
	};
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
    	session=JSON.parse(session);
		this.session=session;
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
	        success:(data:crud.cognitive)=>{
	        	this.cognitive=data;
			    this.setState({
			      cognitive : data
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
		var data={};
		data[parent.id]=this.fields[parent.id];
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/learning/domain/:id${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:users.profile)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
					cognitive:data
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
		var element:EventTarget=event.target;
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/learning/domain/:id${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.cognitive=this.cognitive.filter(function(row:crud.cognitive){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	cognitive : this.cognitive
			    });
	        }
		});
	}
	Filter(event:any){
		var filter=this.cognitive.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.name)==true){
				return true;
			}
			return false;
		});
		var data=JSON.parse(JSON.stringify(this.cognitive));
		data=filter;
		this.setState({
	      	cognitive : data
	    });
	}
	render () {
		if(!this.state.cognitive){
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
					<div className="value" onKeyUp={(e)=>{this.getFields(e)}} onKeyDown={(e)=>{this.keycod(e)}}>{this.state.cognitive.name}</div>
					<div className="toolbox">
						<button className="button circle icons x16 edit white" data-save={false} title="Editar campo" onClick={(e)=>{this.edit(e)}}></button>
					</div>
				</div>
			</div>
			<div className="right">
				<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
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
					this.state.cognitive.map((row:crud.cognitive)=>{
						return (
							<tr key={row._id}>
								<td><b>{row.name}</b></td>
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
