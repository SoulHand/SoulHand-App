import * as React from 'react'
import {ajax} from 'jquery'
import {withRouter} from 'react-router'

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
           <div className="demo-container mdl-grid">
             <div className="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
             <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col">
              <div className="section__circle-container__circle mdl-color--primary"></div>
               <form className="form-signin" onSubmit={(e) => {this.auth(e);}}>
                   <span id="reauth-email" className="reauth-email"></span>
                   <input type="text" name="username" className="mdl-textfield__input" placeholder="Usuario o Correo" autoFocus/>
                   <input type="password" name="password" className="mdl-textfield__input" placeholder="Contraseña"/>
                   <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Iniciar sesión</button>
               </form>
             </div>
           </div>
         </main>
       </div>
     );
   }
 }
