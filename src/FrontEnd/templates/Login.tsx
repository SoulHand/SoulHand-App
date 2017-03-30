import * as React from 'react';
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class Login extends React.Component<{}, {}> {
	public user:any={
		username:null,
		password:null
	}
	componentDidMount(){
		console.log(this);
	}
	getFields(event:any){
		this.user[event.target.id]=event.target.value;
		console.log(this.user)
	}
	auth(event:any){
		ajax({
			method:"POST",
	        url: '//0.0.0:8080/v1/auth',
	        dataType: "json",
	        data:{
	        	username:this.user.username,
	        	password:this.user.password
	        },	        
	        success:(data:any)=>{
	        	let user=JSON.stringify(data);
	        	this.setState({user:user})
	        	localStorage.setItem("session",user);
	        	this.props.router.replace(this.props.location.query.url || '/');
	        }
		});
	}
	render () {
    return (
    	<div className="seccion section text-center">
	      <div className="container">
	        <div className="row">
	          <div className="col-md-12 from text-center">
	            <img src="/images/user-login-icon-14.png" className="center-block img-responsive"/>
	            <form className="form-horizontal from text-center" role="form" onSubmit={(e)=>{this.auth(e)}}>
	              <div className="form-group has-feedback" id="usuario">
	                <div className="col-sm-2">
	                  <label htmlFor="usuario" className="control-label">Usuario</label>
	                </div>
	                <div className="col-sm-10" id="usuario">
	                  <input type="text" className="form-control cuadro" id="username" placeholder="Usuario" onChange={(e)=>{this.getFields(e)}}/>
	                </div>
	                <div className="col-sm-offset-2 col-sm-10">
	                  <p className="help-block t-left"></p>
	                </div>
	              </div>
	              <div className="form-group" id="password">
	                <div className="col-sm-2">
	                  <label htmlFor="password" className="control-label">Contrasena</label>
	                </div>
	                <div className="col-sm-10 cuadro">
	                  <input type="password" className="form-control cuadro" id="password" onChange={(e)=>{this.getFields(e)}} placeholder="Contraseña"/>
	                </div>
	              </div>
		          <div className="form-group">
		            <button type="submit" className="boton-e btn btn-lg btn-success" data-toggle="modal" id="entrar">
		              <b>Entrar</b>
		            </button>
		            <button type="submit" className="boton-e btn btn-lg btn-primary" data-toggle="modal" id="entrar">
		              <b>Registro</b>
		            </button>
		          </div>
	            </form>
	          </div>
	        </div>
	      </div>
	    </div>		
    );
  }
}
