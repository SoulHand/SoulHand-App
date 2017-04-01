import * as React from 'react';
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class Login extends React.Component<props.teacherItem, props.teacherState> {
	public user:any={
		username:null,
		password:null
	}
	state = {
		error:null,
		user:null
	};
	getFields(event:any){
		this.user[event.target.id]=event.target.value;
		console.log(this.user)
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
	        success:(data:any)=>{
	        	let user=JSON.stringify(data);
	        	this.setState({user:user})
	        	localStorage.setItem("session",user);
	        	this.props.router.replace(this.props.location.query.url || '/');
	        },
	        error:(data:any)=>{
	        	this.setState({error:"Nombre de usuario o contraseña incorrecta!"});
	        }
		});
	}
	render () {
    return (
		<div className="container">
	        <div className="card card-container" style={{marginTop:"5px"}}>
	            <img id="profile-img" className="profile-img-card" src="/images/user-login-icon-14.png" />
	            <p id="profile-name" className="profile-name-card"></p>
	            <form className="form-signin" onSubmit={(e)=>{this.auth(e)}}>
	                <span id="reauth-email" className="reauth-email"></span>
	                <input type="text" id="username" className="form-control" placeholder="Email address" required autoFocus onChange={(e)=>{this.getFields(e)}}/>
	                <input type="password" id="password" className="form-control" placeholder="Password" required onChange={(e)=>{this.getFields(e)}}/>
	                {this.state.error && (
				    	<div className="alert alert-danger" role="alert">
				    		{this.state.error}
						</div>
				    )}
	                <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign in</button>
	            </form>
	            <a href="#" className="forgot-password text-align center">
	                ¿Olvidó su contraseña?
	            </a>
	            <Link to="/users/create" className="forgot-password  text-align center">
	                Registrarse
	            </Link>
	        </div>
	    </div>
    );
  }
}
