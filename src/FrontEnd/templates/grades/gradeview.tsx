import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {TableStudents} from "../students/tablestudents"


export class GradeView extends React.Component<props.usersItem, props.stateUser {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields={};
	public students=[];
	state = {
		grade:null,
		error:null,
		students:[]
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
	        url: `${window.settings.uri}/v1/grades/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:students.profile)=>{
			    this.setState({
			      grade : data
			    });
	        }
		});
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/people/students/grade/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:students.profile)=>{
	        	this.students=data;
			    this.setState({
			      students: data
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
	        url: `${window.settings.uri}/v1/grades/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,	        
	        success:(data:students.profile)=>{
				element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
				element.setAttribute("data-save","false");
	        	this.setState({
					grade:data
				});
	        },
	        error:(data:any)=>{
	        	this.setState({
					error:data.responseJSON.message
				});
	        }
		});
	}
	Filter(event:any){
		var filter=this.students.filter((row)=>{
			var exp=new RegExp(event.target.value,"i");
			if(exp.test(row.data.name)==true || exp.test(row.data.dni)==true){
				return true;
			}
			return false;
		});
		this.setState({
	      	students : filter
	    });
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
	render () {
		if(!this.state.grade){
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
			<h3>Alumnos del {this.state.grade.name} grado</h3>
			<div className="right">
				<input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
			</div>	
			<TableStudents students={this.state.students} session={this.session} delete={this.deleteField.bind(this)}/>	
    	</div>		
    );
  }	
}