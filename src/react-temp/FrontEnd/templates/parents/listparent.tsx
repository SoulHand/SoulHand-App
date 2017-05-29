import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./Item"
//import * as settings from "../settings"

export class ListParent extends React.Component<{}, states.ListParent> {
	public session:users.sessions;
	public parents:Array<peoples.parents>=[];
	state:states.ListParent={
		parents:[],
		search:""
	};
	constructor(props:{}) {
		super(props);
			let str: string=localStorage.getItem("session");
	    	if(str){
					let session:users.sessions = JSON.parse(str);
		    	this.session=session;
	    	}
	}
	deleteField(data: peoples.parents){
		this.parents=this.parents.filter((row)=>{
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	this.setState({
	      	parents : this.parents
	    });
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/people/parents/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:Array<peoples.parents>)=>{
	        	this.parents=data;
						this.setState({
				      parents : data
				    });
	        }
		});
	}
	Filter(event:any){
		var filter=this.parents.filter((row)=>{
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
		let Parents = this.state.parents.map((row) => {
	      return (
	        <Item parent={row} key={row._id} session={this.session} delete={this.deleteField.bind(this)}/>
	      );
	    });
		return (
			<div className="container">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar" onChange={(e:any)=>{this.Filter(e)}}/>
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
}
