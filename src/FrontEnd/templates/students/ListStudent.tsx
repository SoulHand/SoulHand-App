import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./Item"

export class ListTeachers extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public data:any=[];
	public state:any
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
		this.state = {teachers:[],search:""};
    	session=JSON.parse(session);
		this.session=session;
	}
	deleteField(data: any){
		this.data=this.data.filter(function(row:peoples.teachers){
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	this.setState({
	      	teachers : this.data
	    });
		
	}

	getFields(event:any){
		this.setState({
	      search : event.target.value
	    });
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	this.data=data;
				this.setState({
			      teachers : data
			    });
	        }
		});
	}
	render(){
		let students = this.state.students.map((row:peoples.students) => {
	      return (
	        <Item people={row} key={row._id} session={this.session} delete={this.deleteField.bind(this)}/>
	      );
	    });
		return (
			<div className="container">
				<div className="fieldset" data-align="justify">
					{
						(this.state.students.length>0) ?
							students
						:
							<span className="text-align center">No existen resultados</span>
					}
				</div>
			</div>
		);
	}
}	