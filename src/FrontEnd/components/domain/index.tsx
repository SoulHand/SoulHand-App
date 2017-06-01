import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import * as Cards from '../cards/domain'
import {View} from './view'
import {Menu} from '../app/menu'


 export class Domain extends React.Component <{}, {}>{
   public session: User.session;
   public domains: Array<CRUD.domain>=[];
   state: { domains:  Array<CRUD.domain>} = {
     domains: []
   }
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.domains.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.name)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	domains : filter
 	    });
   	}
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window.settings.uri}/v1/learning/domain/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((domains: Array<CRUD.domain>) => {
       this.domains = domains;
       this.setState({
         domains: domains
       })
     });
   }
   delete(teacher: CRUD.domain){
     this.state.domains = this.domains.filter((row) => {
       if (row._id === teacher._id) {
         return false;
       }
       return true;
     })
     this.setState(this.state);
   }
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
         <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
           <div className="mdl-layout__header-row">
             <span className="mdl-layout-title">SoulHand</span>
             <div className="mdl-layout-spacer"></div>
             <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
               <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
                 <i className="material-icons">search</i>
               </label>
               <div className="mdl-textfield__expandable-holder">
                 <input className="mdl-textfield__input" type="text" id="search" onChange={(e:any)=>{this.Filter(e)}}/>
                 <label className="mdl-textfield__label" htmlFor="search">Ingrese su consulta...</label>
               </div>
             </div>
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
          <Menu/>
          <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid demo-content">
             {this.state.domains.map((row) => {
               return (
               <Cards.Domain key={row._id} domain={row} session={this.session}/>
               );
             })}
          </div>
          </main>
       </div>
     );
   }
 }

 export let Get = View;
