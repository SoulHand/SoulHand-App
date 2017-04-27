import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Step3 extends React.Component<Props.GenericRouter, {objetive:crud.objetive}> {
	public session:users.sessions;
	public state:{objetive:crud.objetive}={
		objetive:null
	}
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
				      objetive : data
				    });
	        }
		});
	}
	render () {
		if(!this.state.objetive){
			return(
				<div className="card card-container" style={{marginTop:"5px"}}>
					<div className="flex column vh-align middle">
							<div className="icon animations transitions-cubic"></div>
							<div className="label">cargando...</div>
					</div>
				</div>
			);
		}
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>El objetivo ha sido creado</h1>
				<p className="text-align justify">El objetivo se clasifico en el dominio <b>{this.state.objetive.domain.name}</b>, nivel <b>{this.state.objetive.level.name}</b></p>
				<p className="text-align justify">Este objetivo ayudara a incrementar el nivel de evaluación del conocimiento en sus alumnos</p>
				<Link to={`/objetive/create/step4/${this.props.routeParams.objetive}`} className="button btn-success">Continuar</Link>
			</div>
    );
  }
}
