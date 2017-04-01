import * as React from 'react';
import * as validator from 'string-validator';
import {ajax} from 'jquery'

export class KnowledgeLevelView extends React.Component<{}, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;	
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
		this.state = {knowledgelevel:[],search:""};
    	session=JSON.parse(session);
		this.session=session;
		this.state = {knowledgelevel:null};
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
			      knowledgelevel : data
			    });
	        }
		});
	}
	render () {
    return (
    	<div className="container">
    		{this.state.knowledgelevel && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>
		              <b>{(this.state.knowledgelevel.data.mode=="KNOWLEDGELEVEL") ? "Docente": "Alumno"}</b>
		            </h3>
		            <p>
		              <b>Nombre:</b>{this.state.knowledgelevel.data.name}
		            </p>
		            <p>
		              <b>Edad Minima:</b>{this.state.knowledgelevel.data.nim}
		            </p>
		            <p>
		              <b>Edad Maxima:</b>{this.state.knowledgelevel.data.max}
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