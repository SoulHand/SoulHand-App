import * as React from 'react'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router'

@withRouter
 export class Login extends React.Component <Props.GenericRouter, {error:any}>{
   state: {error:any}={
     error:null
   }
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
   }
   auth(event:any){
     event.preventDefault();
 	    this.setState({error:null})
 		ajax({
 			method:"POST",
 	        url: `${window._BASE}/v1/auth`,
 	        dataType: "json",
 	        data:$(event.target).serialize(),
 	        success:(data:User.sessions)=>{
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
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-layout--fixed-header mdl-js-layout mdl-color--grey-100">
         <header className="demo-header mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
           <div className="mdl-layout__header-row">
             <span className="mdl-layout-title">SoulHand</span>
             <div className="mdl-layout-spacer"></div>
           </div>
         </header>
         <div className="demo-ribbon"></div>
         <main className="demo-main mdl-layout__content">
          <div className="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
          <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col">
          <div className="section__circle-container__circle mdl-color--primary"></div>
          <div className=" demo-container mdl-grid">
            <div className="mdl-grid mdl-cell mdl-cell--4">

            </div>
            <div className="mdl-grid mdl-cell mdl-cell--4">
              <form className="form-signin" onSubmit={(e) => {this.auth(e);}}>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="text" name="username" id="username"/>
                    <label className="mdl-textfield__label" htmlFor="username">Nombre de Usuario</label>
                    <span className="mdl-textfield__error">Es obligatorio</span>
                  </div>
                  <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                    <input className="mdl-textfield__input" type="password" name="password" id="password"/>
                    <label className="mdl-textfield__label" htmlFor="password">Contraseña</label>
                    <span className="mdl-textfield__error">Es obligatorio</span>
                  </div>
                  <div className="mdl-grid">
                    <div className="mdl-cell mdl-cell--6-col">
                      <a href="#/teachers/get/595f61a45d15193ac4cdf224">¿Se me olvidó la contraseña?</a>
                    </div>
                    <div className="mdl-cell mdl-cell--6-col">
                      <Link to="/registry">Registrarse</Link>
                    </div>
                  </div>
                  <button className="mdl-button mdl-js-button mdl-button--raised button--colored" type="submit">Iniciar sesión <i className="material-icons">navigate_next</i></button>
              </form>
            </div>
          </div>
        </div>
       </main>
     </div>
     );
   }
 }
