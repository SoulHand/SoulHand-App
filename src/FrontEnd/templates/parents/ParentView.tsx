import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'

export class ParentView extends React.Component<{}, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	state={
		parents:[],
		search:""
	};
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
    	session=JSON.parse(session);
		this.session=session;
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	this.data=data;
				this.setState({
			      parents : data
			    });
	        }
		});
	}
	
	render () {
    return (
    	<div className="container">
    		{this.state.parents && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>
		              <b>{(this.state.parents.data.mode=="TEACHER") ? "Docente": "Alumno"}</b>
		            </h3>
		            <p>
		              <b>Nombre y Apellido:</b>{this.state.parents.data.name}
		            </p>
		          </div>
		        </div>		    	
		    )}	        
    	</div>		
    );
  }
}
