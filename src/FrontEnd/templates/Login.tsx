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
	        beforeSend: (xhr)=>{
	        	xhr.setRequestHeader ("Authorization", "Basic " + btoa(this.user.username + ":" + this.user.password));
	        },
	        success:(data)=>{
	        	console.log(data)
	        	let user=JSON.stringify(data);
	        	this.setState({user:user})
	        	localStorage.setItem("session",user);          
	        }
		});
	}
	render () {
    return (
		<div className="container">
			<div className="box">
		        <form className="form-signin"  onSubmit={(e)=>{this.auth(e)}}>
		          <h2 className="form-signin-heading">Iniciar Sección</h2>
		          <label htmlFor="username" className="sr-only">Nombre de usuario</label>
		          <input type="text" id="username" className="form-control" placeholder="usuario" onChange={(e)=>{this.getFields(e)}} required autoFocus/>
		          <label htmlFor="password" className="sr-only">Contraseña</label>
		          <input type= "password" className="form-control" id="password" maxLength={18} onChange={(e)=>{this.getFields(e)}} required/>
		          
		          <button className="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
		        </form>        
	      	</div>
      	</div>
    );
  }
}
