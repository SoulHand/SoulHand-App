import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./item"
//import * as settings from "../settings"

export class ListUsers extends React.Component<{}, states.UserList> {
	public session:users.sessions;
	public users:Array<users.profile>=[];
	state:states.UserList={
		users:[],
		error:null
	};
	constructor(props:{}) {
		super(props);
			let str: string=localStorage.getItem("session");
	    	if(str){
					let session:users.sessions = JSON.parse(str);
		    	this.session=session;
	    	}
	}
	deleteField(data: any){
		this.users=this.users.filter(function(row:users.profile){
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	this.setState({
	      	users : this.users
	    });
	}
	Filter(event:any){
		var filter=this.users.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.username)==true || exp.test(row.email)==true){
				return true;
			}
			return false;
		});
		this.setState({
	      	users : filter
	    });
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/users/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:Array<users.profile>)=>{
	        	this.users=data;
						this.setState({
				      users : data
				    });
	        },error:(data:any)=>{
	        	var state=this.state.error;
	        	state.server=data.responseJSON;
	        	this.setState({
							error:state
						});
	        }
		});
	}
	render(){
		let teachers = this.state.users.map((row:users.profile) => {
	      return (
	        <Item user={row} key={row._id} session={this.session} delete={this.deleteField.bind(this)}/>
	      );
	    });
		return (
			<div className="container">
				{this.state.error && (
					<div className="alert alert-warning alert-dismissible fade show" role="alert">
					  <button type="button" className="close" data-dismiss="alert" aria-label="Close">
					    <span aria-hidden="true">&times;</span>
					  </button>
					  {this.state.error}
					</div>
				)}
					<div className="right">
						<input type="text" className="form-control" placeholder="Buscar" onChange={(e:any)=>{this.Filter(e)}}/>
					</div>
				<div className="fieldset" data-align="justify">
					{
						(this.state.users.length>0) ?
							teachers
						:
							<span className="text-align center">No existen resultados</span>
					}
				</div>
			</div>
		);
	}
}
