import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'

export class GradeView extends React.Component<{}, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;	
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
		this.state = {grade:[],search:""};
    	session=JSON.parse(session);
		this.session=session;
		this.state = {grade:null};
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/grade/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	this.data=data;
				this.setState({
			      grade : data
			    });
	        }
		});
	}
	render () {
    return (
    	<div className="container">
    		{this.state.grade && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>
		              <b>{(this.state.grade.data.mode=="GRADE") ? "Docente": "Alumno"}</b>
		            </h3>
		            <p>
		              <b>Nombre:</b>{this.state.grade.data.name}
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