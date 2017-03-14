import * as React from 'react';
import {getJSON} from 'jquery'

export class Login extends React.Component<{}, {}> {
	auth(username:string,password:string){
		getJSON('//0.0.0:8080/v1/auth',{
			beforeSend:function(xhr){
				xhr.setHeader("")
			}
		})
	}
	render () {
    return (
		<div className="container">
			<div className="box">
		        <form className="form-signin" onSubmit>
		          <h2 className="form-signin-heading">Iniciar Sección</h2>
		          <label htmlFor="nombre_usuario" className="sr-only">Nombre de usuario</label>
		          <input type="email" id="usuario" className="form-control" placeholder="usuario" required autoFocus/>
		          <label htmlFor="contraseña" className="sr-only">Contraseña</label>
		          <input type= "password" value="" className="form-control" id="contraseña" maxLength={18} required autoFocus/>
		          
		          <button className="btn btn-lg btn-primary btn-block" type="submit">Entrar</button>
		        </form>        
	      	</div>
      	</div>
    );
  }
}
