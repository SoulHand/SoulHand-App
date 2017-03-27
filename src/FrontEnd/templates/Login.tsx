import * as React from 'react';
import {ajax} from 'jquery'

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
			method:"get",
	        url: '//0.0.0:8080/v1/auth',
	        dataType: "json",
	        data:null,
	        beforeSend: (xhr:any)=>{
	        	xhr.setRequestHeader ("Authorization", "Basic " + btoa(this.user.username + ":" + this.user.password));
	        },
	        success:(data:any)=>{
	        	console.log(data)
	        	let user=JSON.stringify(data);
	        	this.setState({user:user})
	        	localStorage.setItem("session",user);          
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
	                  <label htmlFor="Password" className="control-label">Contrasena</label>
	                </div>
	                <div className="col-sm-10 cuadro">
	                  <input type="password" className="form-control cuadro" id="Password" onChange={(e)=>{this.getFields(e)}} placeholder="Contraseña"/>
	                </div>
	              </div>
	            </form>
	          </div>
	          <div className="form-group">
	            <button type="submit" className="boton-e btn btn-lg btn-success" data-toggle="modal" id="entrar" contentEditable={true}>
	              <b>Entrar</b>
	            </button>
	            <button type="submit" className="boton-e btn btn-lg btn-primary" data-toggle="modal" id="entrar" contentEditable={true}>
	              <b>Registro</b>
	            </button>
	          </div>
	        </div>
	      </div>
	    </div>		
    );
  }
}
