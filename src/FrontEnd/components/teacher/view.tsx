import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Teacher} from '../cards/teacher'
import * as List from '../profiles/teacher'
import { App, ModalFree } from '../app'
import { HeaderFree } from '../app/header'

@withRouter
 export class View extends React.Component <Props.teacherView, Obj.teacher>{
   public session: User.session;
   public init: boolean = false;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       teacher: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: People.teacher)=>{
            this.props.router.replace('/teachers');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((teacher: People.teacher) => {
       this.init = true;
       this.setState({
         teacher: teacher
       })
     });
   }
   render(){
     if (!this.init) {
       return (
         <ModalFree />
       );
     }
     return (
       <div className="mdl-layout mdl-layout--fixed-header">
         <HeaderFree title={this.state.student.data.name} menu={
           [
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn" key="BUTTON1">
               <i className="material-icons">more_vert</i>
             </button>
             ,
             <ul className="mdl-menu mdl-js-menu mdl-js-ripple effect mdl-menu--bottom-right" htmlFor="hdrbtn" key="hdrbtn12">
               <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.push(`/teachers/edit/${this.props.routeParams.id}`);
               }}>Editar</li>
               <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.push(`/teachers/grade/edit/${this.props.routeParams.id}`);
               }}>Asignar grado</li>
               <li className="mdl-menu__item" onClick={(e) => { this.delete() }}>Eliminar</li>
             </ul>
           ]
         } />
         <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
         <div className="demo-ribbon mdl-color--teal-400" />
         <main className="demo-main mdl-layout__content">
           <div className="demo-container mdl-grid">
             <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
               <List.Teacher teacher={this.state.teacher} />
             </div>
            </div>
            <div className="mdl-grid demo-content">
            </div>
         </main>
       </div>
     );
   }
 }
