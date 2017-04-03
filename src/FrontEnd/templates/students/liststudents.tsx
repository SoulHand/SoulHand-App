import * as React from 'react';
import {getJSON, ajax} from 'jquery'
import {Link} from 'react-router'
import {TableStudents} from "./tablestudents"


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
	deleteField(data: any){
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
			<TableStudents students={this.state.students} session={this.session} delete={this.deleteField.bind(this)}/>			
		</div>
    );
  }
}
