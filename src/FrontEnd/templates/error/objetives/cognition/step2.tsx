import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';
import {TableCognitionsAdd} from '../../../objetives/tablecognitionsadd';


@withRouter
export class Step2 extends React.Component<Props.GenericRouter, {error:any, cognitions:Array<crud.cognition>}> {
	public session:users.sessions;
  public objetive:crud.objetive;
  public state:{error:any, cognitions:Array<crud.cognition>}={
    cognitions:null,
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
		var p1=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/knowedge/objetives/${this.props.routeParams.objetive}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		});
    p1.done().then((data:crud.objetive)=>{
			this.objetive=data;
      let p2=ajax({
  			method:"GET",
  	        url: `${window.settings.uri}/v1/learning/domain/${data.domain._id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
  	        dataType: "json",
  	        data:null,
  		});
      return p2.done();
    }).then((data:crud.domain)=>{
      this.setState({
        cognitions:data.cognitions
      });
    });
	}
	delete(id:string){
			this.state.cognitions=this.state.cognitions.filter((row)=>{
				if(row._id==id){
					return false;
				}
				return true;
	    });
	  	this.setState({
	      	cognitions : this.state.cognitions
	    });
	}
	render () {
		console.log(this.state.cognitions);
    if(!this.state.cognitions){
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
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>Seleccione las mejores opciones</h1>
				<p>Seleccione las funciones cognitivas que representan su objetivo, así ayudara a evitar errores</p>
				<TableCognitionsAdd domain={this.objetive.domain.name} level={this.objetive.level.name} objetive={this.props.routeParams.objetive} cognitions={this.state.cognitions} session={this.session} callback={this.delete.bind(this)}/>
				<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
				<Link to={`/error/resolve/objetive/${this.props.routeParams.objetive}/cognition/step3`} className="button btn-success">Continuar</Link>
			</div>
    );
  }
}
