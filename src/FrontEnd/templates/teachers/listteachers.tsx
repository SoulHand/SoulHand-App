import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./item"
import {TableTeachers} from "./tableteachers"
//import * as settings from "../settings"

export class ListTeachers extends React.Component<{}, states.ListTeachers> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public teachers:Array<peoples.teachers>=[];
	state:states.ListTeachers={
		teachers:[],
		search:""
	};
	constructor(props:any) {
		super(props);
		let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
	}
	deleteField(data: peoples.teachers){
		this.teachers=this.teachers.filter(function(row:peoples.teachers){
			if(row._id==data._id){
				return false;
			}
			return true;
    	});
    	this.setState({
	      	teachers : this.teachers
	    });
	}
	Filter(event:any){
		var filter=this.teachers.filter((row:peoples.teachers)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.data.name)==true || exp.test(row.data.dni)==true || (row.grade && exp.test(row.grade.name)==true)){
				return true;
			}
			return false;
		});
		this.setState({
	      	teachers : filter
	    });
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:Array<peoples.teachers>)=>{
	        this.teachers=data;
				this.setState({
			      teachers : data
			    });
	        }
		});
	}
	render(){
		return (
			<div className="container card">
				<div className="right">
					<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
				</div>
				<h3>Docentes</h3>
				<TableTeachers teachers={this.state.teachers} session={this.session} delete={this.deleteField.bind(this)}/>
			</div>
		);
	}	
}
