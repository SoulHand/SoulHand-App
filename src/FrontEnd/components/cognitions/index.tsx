import * as React from 'react'
import {ajax} from 'jquery'
import { Link, withRouter } from 'react-router'
import {App} from '../app'
import * as Cards from '../cards/cognition'
import {View} from './view'
import {Objetives} from './objetives'
import { CognitionCreate } from './cognitioncreate'
import {ParentCreate} from './parentcreate'
import { LevelCreate } from './levelcreate'
import {Menu} from '../app/menu'


@withRouter
 export class Cognitions extends React.Component <{router: any}, {}>{
   public session: User.session;
   public init: boolean = false;
   public cognitions: Array<CRUD.cognition>=[];
   state: { cognitions:  Array<CRUD.cognition>} = {
     cognitions: []
   }
   constructor(props: { router: any }){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.cognitions.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.name)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	cognitions : filter
 	    });
   	}
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/cognitions/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((cognitions: Array<CRUD.cognition>) => {
       this.cognitions = cognitions;
       this.init = true;
       this.setState({
         cognitions: cognitions
       })
     });
   }
   delete(teacher: CRUD.cognition){
     this.state.cognitions = this.cognitions.filter((row) => {
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
         <div className="mdl-grid">
           {this.state.cognitions.length > 0 && this.state.cognitions.map((row) => {
             return (
               <Cards.Cognition key={row._id} cognition={row} session={this.session} delete={this.delete.bind(this)} />
             );
           })}
         </div>
         <div className="fixed">
           <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
           <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
             data-mdl-for="add-menu">
             <li className="mdl-menu__item" onClick={(e) => {
               this.props.router.push("/cognitions/create");
             }}>
               <i className="material-icons">explore</i> Añadir una función cognitiva
                  </li>
           </ul>
         </div>
      </App>
     );
   }
 }

 export let Get = View;
 export let Add = CognitionCreate;
