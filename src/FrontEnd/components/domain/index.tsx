import * as React from 'react'
import {ajax} from 'jquery'
import { Link, withRouter } from 'react-router'
import {App} from '../app'
import * as Cards from '../cards/domain'
import {View} from './view'
import {Objetives} from './objetives'
import {CognitionView} from './cognition'
import { DomainCreate } from './domaincreate'
import {ParentCreate} from './parentcreate'
import { LevelCreate } from './levelcreate'
import {Menu} from '../app/menu'


@withRouter
 export class Domain extends React.Component <{router: any}, {}>{
   public session: User.session;
   public init: boolean = false;
   public domains: Array<CRUD.domain>=[];
   state: { domains:  Array<CRUD.domain>} = {
     domains: []
   }
   constructor(props: { router: any }){
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
       url: `${window._BASE}/v1/learning/domain/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((domains: Array<CRUD.domain>) => {
       this.domains = domains;
       this.init = true;
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
     if(!this.init){
       return (
         <App/>
       );
     }
     return(
      <App>
         <div className="mdl-grid demo-content">
           {this.state.domains.length == 0 && (
             <span>No posee dominios registrados</span>
           )}
           {this.state.domains.length > 0 && this.state.domains.map((row) => {
             return (
               <Cards.Domain key={row._id} domain={row} session={this.session} delete={this.delete.bind(this)} />
             );
           })}
         </div>
         <div className="fixed">
           <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
           <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
             data-mdl-for="add-menu">
             <li className="mdl-menu__item" onClick={(e) => {
               this.props.router.push("/domains/create");
             }}>
               <i className="material-icons">explore</i> Añadir un dominio de aprendizaje
                  </li>
             <li className="mdl-menu__item" onClick={(e) => {
               this.props.router.push("/objetives/create");
             }}>
               <i className="material-icons">lightbulb_outline</i> Añadir un objetivo de aprendizaje
                  </li>
           </ul>
         </div>
      </App>
     );
   }
 }

 export let Get = View;
 export let Objetive = Objetives;
 export let Cognition = CognitionView;
 export let Add = ParentCreate;
 export let AddDomain = DomainCreate;
 export let AddLevel = LevelCreate;
