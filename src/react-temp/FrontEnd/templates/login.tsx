import * as React from 'react';
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Login extends React.Component<Props.UserLogin, states.SessionLogin> {
	public user:compat.Map={
		username:null,
		password:null
	}
	state:states.SessionLogin = {
		error:null,
		user:null
	};
	getFields(event:any){
		this.user[event.target.id]=event.target.value;
	}
	auth(event:any){
	    this.setState({error:null})
		ajax({
			method:"POST",
	        url: `${window.settings.uri}/v1/auth`,
	        dataType: "json",
	        data:{
	        	username:this.user.username,
	        	password:this.user.password
	        },
	        success:(data:users.sessions)=>{
	        	this.setState({user:data})
						let user:string=JSON.stringify(data);
						let url:any= this.props.location.query;
	        	localStorage.setItem("session",user);
	        	this.props.router.replace(url.url || '/');
	        },
	        error:(data:any)=>{
	        	this.setState({error:"Nombre de usuario o contraseña incorrecta!"});
	        }
		});
	}
	render () {
    return (
			<div className="content" data-app="soulhand-services" data-align="left">
				<div className="body">
					<div className="container">
						<section className="page">
							<div className="container-body">
								<div className="card card-container" style={{marginTop:"5px"}}>
										<img id="profile-img" className="profile-img-card" src="/images/user-login-icon-14.png" />
										<p id="profile-name" className="profile-name-card"></p>
										<form className="form-signin" onSubmit={(e:any)=>{this.auth(e)}}>
												<span id="reauth-email" className="reauth-email"></span>
												<input type="text" id="username" className="form-control" placeholder="Usuario o Correo" required autoFocus onChange={(e:any)=>{this.getFields(e)}}/>
												<input type="password" id="password" className="form-control" placeholder="Contraseña" required onChange={(e:any)=>{this.getFields(e)}}/>
												{this.state.error && (
										<div className="alert alert-danger" role="alert">
											{this.state.error}
									</div>
									)}
												<button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Iniciar sesión</button>
										</form>
										<a href="#" className="forgot-password text-align center">
												¿Olvidó su contraseña?
										</a>
										<Link to="/users/create" className="forgot-password  text-align center">
												Registrarse
										</Link>
								</div>
							</div>
						</section>
					</div>
				</div>
			</div>
    );
  }
}
