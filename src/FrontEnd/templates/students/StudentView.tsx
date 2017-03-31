import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'

export class StudentView extends React.Component<{}, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;	
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
		this.state = {teachers:[],search:""};
    	session=JSON.parse(session);
		this.session=session;
		this.state = {teacher:null};
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	this.data=data;
				this.setState({
			      teacher : data
			    });
	        }
		});
	}
	render () {
    return (
    	<div className="container">
    		{this.state.Student && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>
		              <b>{(this.state.Student.data.mode=="STUDENT") ? "Docente": "Alumno"}</b>
		            </h3>
		            <p>
		              <b>Nombre y Apellido:</b>{this.state.Student.data.name}
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