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
		this.state = {KnowledgeLevel:[],search:""};
    	session=JSON.parse(session);
		this.session=session;
		this.state = {KnowledgeLevel:null};
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `//0.0.0:8080/v1//${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	this.data=data;
				this.setState({
			      KnowledgeLevel : data
			    });
	        }
		});
	}
	render () {
    return (
    	<div className="container">
    		{this.state.KnowledgeLevel && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>
		              <b>{(this.state.KnowledgeLevel.data.mode=="KNOWLEDGELEVEL") ? "Docente": "Alumno"}</b>
		            </h3>
		            <p>
		              <b>Nombre:</b>{this.state.KnowledgeLevel.data.name}
		            </p>
		            <p>
		              <b>Edad Minima:</b>{this.state.KnowledgeLevel.data.nim}
		            </p>
		            <p>
		              <b>Edad Maxima:</b>{this.state.KnowledgeLevel.data.max}
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