import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Step2 extends React.Component<Props.GenericRouter, {error:any, domain:crud.domain}> {
	public session:users.sessions;
  public state:{error:any, domain:crud.domain}={
    domain:null,
    error:null
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
	        url: `${window.settings.uri}/v1/learning/domain/${this.props.routeParams.domain}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:crud.domain)=>{
				    this.setState({
				      domain : data
				    });
	        }
		});
	}
	render () {
    if(!this.state.domain){
      return (
        <div className="card card-container" style={{marginTop:"5px"}}>
          {this.state.error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error!</strong>{this.state.error}
            </div>
          )}
          <div className="loadding"></div>
        </div>
      );
    }
    var level=this.state.domain.levels.filter((row)=>{
        if(row._id==this.props.routeParams.level){
          return true;
        }
        return false;
    });
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>Crear un objetivos de aprendizaje</h1>
        <p>Esta a punto de crear un objetivo en el dominio <b>{this.state.domain.name.toLocaleLowerCase()}</b></p>
        <p><b>Descripción</b>: {this.state.domain.description.toLocaleLowerCase()}</p>
        <p><b>Nivel de aprendizaje</b>: {level[0].level}</p>
        <p><b>Nombre</b>: {level[0].name.toLocaleLowerCase()}</p>
        <p>El nivel determina la etapa en el aprendizaje que adquirirá nuevos conocimientos el alumno</p>
				<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
				<Link to={`/objetive/create/${this.state.domain.name}/${level[0].name}/step3`} className="button btn-success">Continuar</Link>
			</div>
    );
  }
}
