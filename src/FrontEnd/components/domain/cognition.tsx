import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import { CognitionObjective } from '../cards/cognition'
import { App, ModalFree } from '../app'
import { HeaderFree } from '../app/header'

@withRouter
 export class CognitionView extends React.Component <Props.objetiveView, CRUD.objetive>{
   public session: User.session;
   public cognitions: Array<CRUD.cognition> = [];
   public init: boolean = false;
   constructor(props:Props.objetiveView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   delete(cognition: CRUD.cognition){
     let obj = this.cognitions.filter((row) => {
       if (row._id === cognition._id) {
         return false;
       }
       return true;
     })
     this.setState({
       cognitions: obj
     });
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/objetives/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((cognition: CRUD.objetive) => {
       this.cognitions = cognition.cognitions;
       this.init = true;
       this.setState(cognition);
     });
     componentHandler.upgradeAllRegistered();
   }
   render(){
     if (!this.init) {
       return (
         <ModalFree />
       );
     }
     return (
       <div className="mdl-layout mdl-layout--fixed-header">
         <HeaderFree title={"Objetivo de aprendizaje" + this.state.name} />
         <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
         <div className="demo-ribbon mdl-color--teal-400" />
         <main className="demo-main mdl-layout__content">
           <div className="demo-container mdl-grid">
             <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
               <div className="mdl-cell--6-col mdl-cell--middle">
                 <div className="mdl-textfield">
                   <label className="mdl-input__expandable-holder">Nombre:</label>
                   <div className="mdl-textfield__input">
                     {this.state.name}
                   </div>
                 </div>
               </div>
               <div className="mdl-cell--6-col mdl-cell--middle">
                 <div className="mdl-textfield">
                   <label className="mdl-input__expandable-holder">Descripción</label>
                   <div className="mdl-textfield__input">
                     {this.state.description}
                   </div>
                 </div>
               </div>
               <div className="mdl-cell--6-col mdl-cell--middle">
                 <div className="mdl-textfield">
                   <label className="mdl-input__expandable-holder">Dominio</label>
                   <div className="mdl-textfield__input">
                     {this.state.domain.name}
                   </div>
                 </div>
               </div>
               <div className="mdl-cell--6-col mdl-cell--middle">
                 <div className="mdl-textfield">
                   <label className="mdl-input__expandable-holder">Nivel</label>
                   <div className="mdl-textfield__input">
                     ({this.state.level.level}) {this.state.level.name}
                   </div>
                 </div>
               </div>
               <div className="mdl-cell--12-col mdl-cell--middle">
                 <span className="mdl-typography--title">Categorías gramaticales</span>
                 {
                   this.state.words.map((row) => {
                     return (
                       <span className="mdl-chip" key={row}>
                         <span className="mdl-chip__text" title={row}>{row}</span>
                       </span>
                     );
                   })
                 }
               </div>
             </div>
           </div>
           <span className="mdl-typography--title">Funciones cognitivas desarrolladas</span>
           <div className="mdl-grid">
             {
               this.state.cognitions.map((row) => {
                 return (
                   <CognitionObjective session={this.session} cognition={row} key={row._id} delete={this.delete.bind(this)} objetive={this.props.routeParams.id}/>
                 );
               })
             }
           </div>
           <div className="fixed">
             <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
             <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
               data-mdl-for="add-menu">
              <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.push(`/objetives/get/${this.props.routeParams.id}/cognition`);
              }}>
                 <i className="material-icons">explore</i> Asignar funciones cognitivas
              </li>
             </ul>
           </div>
         </main>
       </div>
     );
   }
 }
