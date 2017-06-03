import * as React from 'react'
import "../../images/user.png"

 export class UserBox extends React.Component <Obj.session, {}>{
   render(){
     return (
       <header className="demo-drawer-header">
         <img src="user.png" className="demo-avatar"/>
         <div className="demo-avatar-dropdown">
           <span>{this.props.session.user.username}</span>
           <div className="mdl-layout-spacer"></div>
           <button id="accbtn" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon">
             <i className="material-icons" role="presentation">arrow_drop_down</i>
             <span className="visuallyhidden">Accounts</span>
           </button>
           <ul className="mdl-menu mdl-menu--bottom-right mdl-js-menu mdl-js-ripple-effect" htmlFor="accbtn">
             <li className="mdl-menu__item"><i className="material-icons">people</i> Mi perfil</li>
             <li className="mdl-menu__item"><i className="material-icons">add</i>Cerrar sesión</li>
           </ul>
         </div>
       </header>
     );
   }
 }
