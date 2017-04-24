import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Step1 extends React.Component<Props.GenericRouter, states.ObjetiveSelect> {
	public session:users.sessions;
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
	        url: `${window.settings.uri}/v1/learning/domain/${this.props.routeParams.domain}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:Array<crud.domain>)=>{
				    this.setState({
				      domains : data
				    });
	        }
		});
	}
	render () {
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>Objetivos de aprendizaje</h1>
				<p className="text-align justify">Los objetivos de aprendizaje son un conjunto de conocimientos, aptitudes o conductas que los estudiantes deben aprender, comprender o ejecutar como resultado de un aprendizaje.</p>
				<p className="text-align justify">Es necesario que te enfoques en tus metas a futuro dentro del salon de clases y que deseas que tus alumnos adquieran durante su proceso de aprendizaje</p>
				<p><b>Te ayudaremos a crear un objetivo adecuado a tus alumnos</b></p>
			</div>
    );
  }
}
