import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'

export class TeacherView extends React.Component<props.teacherItem, props.teacherState> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public teachers:peoples.teachers;
	state={
		teacher:null
	};
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	var session=JSON.parse(str);
		this.session=session;
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:peoples.teachers)=>{
	        	this.teachers=data;
				this.setState({
			      teacher : data
			    });
	        }
		});
	}
	
	render () {
    return (
    	<div className="container">
    		{this.state.teacher && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>
		              <b>{(this.state.teacher.data.mode=="TEACHER") ? "Docente": "Alumno"}</b>
		            </h3>
		            <p>
		              <b>Nombre y Apellido:</b>{this.state.teacher.data.name}
		            </p>
		          </div>
		        </div>		    	
		    )}		
	        <h2>Actividades:</h2>
	        <div className="fieldset" data-align="justify">
	        	<span className="text-align center">No posee actividades</span>
	        </div>
    	</div>		
    );
  }
}
