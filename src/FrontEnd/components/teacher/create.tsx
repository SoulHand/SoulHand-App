import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class Create extends React.Component <{}, {}>{
   public session: User.session;
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   componentDidUpdate(){
     console.log("registrando!");
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
       <div className="mdl-grid demo-content">
          hola añadir
       </div>
     );
   }
 }
