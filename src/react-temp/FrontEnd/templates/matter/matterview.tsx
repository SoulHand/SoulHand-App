import * as React from 'react';
import {ajax} from 'jquery'

export class MatterView extends React.Component<Props.MatterView, states.MatterView> {
	public session:users.sessions;
	public matter: crud.courses;
	constructor(props:Props.MatterView) {
		super(props);
			let str: string=localStorage.getItem("session");
	    	if(str){
					let session:users.sessions = JSON.parse(str);
		    	this.session=session;
	    	}
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/courses/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:crud.courses)=>{
	        	this.matter=data;
						this.setState({
				      matter : data
				    });
	        }
		});
	}

	render () {
    return (
    	<div className="container">
    		{this.state.matter && (
	    		<div className="row">
		          <div className="col-md-2">
		            <img src="/images/user-login-icon-14.png" className="imagen img-circle img-responsive"/>
		          </div>
		          <div className="col-md-10 parrafo">
		            <h3>{this.state.matter.name}</h3>
		          </div>
		        </div>
		    )}
    	</div>
    );
  }
}
