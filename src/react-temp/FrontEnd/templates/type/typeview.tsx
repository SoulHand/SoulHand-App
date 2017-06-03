import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'

export class TypeView extends React.Component<{}, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;	
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
		this.state = {type:[],search:""};
    	session=JSON.parse(session);
		this.session=session;
		this.state = {type:null};
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/learning/type/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,	        
	        success:(data:any)=>{
	        	this.data=data;
				this.setState({
			      type : data
			    });
	        }
		});
	}
	render () {
    return (
    	<div className="container">
    		{this.state.type && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>
		              <b>{(this.state.type.data.mode=="TYPE") ? "Docente": "Alumno"}</b>
		            </h3>
		            <p>
		              <b>Nombre:</b>{this.state.type.data.name}
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