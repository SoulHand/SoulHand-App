import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import {TableCognitions} from "../domain/tablecognitions"

export class ObjetiveView extends React.Component<Props.GenericRouter, {error:any,objetive:crud.objetive,cognitions:Array<crud.cognition>}> {
	public session:users.sessions;
	public state:{error:any,objetive:crud.objetive,cognitions:Array<crud.cognition>} = {
		objetive:null,
		error:null,
    cognitions:[]
	};
	constructor(props:Props.GenericRouter) {
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
	        url: `${window.settings.uri}/v1/knowedge/objetives/${this.props.routeParams.objetive}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:crud.objetive)=>{
  			    this.setState({
  			      objetive : data,
              cognitions:data.cognitions
  			    });
	        }
		});
	}
	render () {
		if(!this.state.objetive){
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
      <h1>{this.state.objetive.name}</h1>
      <p>{this.state.objetive.description}</p>
			<h3>Funciones cognitivas</h3>
			<TableCognitions cognitions={this.state.cognitions}/>
    	</div>
    );
  }
}
