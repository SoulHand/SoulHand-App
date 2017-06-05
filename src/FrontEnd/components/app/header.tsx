import * as React from 'react'

 export class Header extends React.Component <{}, {}>{
   render(){
     return (
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>           
           <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
             <i className="material-icons">more_vert</i>
           </button>
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
             <li className="mdl-menu__item">A cerca de</li>
             <li className="mdl-menu__item">Contacto</li>
             <li className="mdl-menu__item">Información legal</li>
           </ul>
         </div>
       </header>
     );
   }
 }
