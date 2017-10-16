import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Student} from '../cards/student'
import * as List from '../profiles/parent'
import { App, ModalFree } from '../app'
import { HeaderFree } from '../app/header'

@withRouter
 export class View extends React.Component <Props.teacherView, {parent: People.parent}>{
   public session: User.session;
   public init: boolean = false;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       parent: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   deleteStudent(student: People.student) {
     this.state.parent.students = this.state.parent.students.filter((row) => {
       if (row._id === student._id) {
         return false;
       }
       return true;
     })
     this.setState(this.state);
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: People.parent)=>{
            this.props.router.replace('/parents');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((parent: People.teacher) => {
       this.init = true;
       this.setState({
         parent: parent
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
         <HeaderFree title={this.state.parent.data.name} menu={
           [
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn" key="BUTTON1">
               <i className="material-icons">more_vert</i>
             </button>
             ,
             <ul className="mdl-menu mdl-js-menu mdl-js-ripple effect mdl-menu--bottom-right" htmlFor="hdrbtn" key="hdrbtn12">
               <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.push(`/parents/edit/${this.props.routeParams.id}`);
               }}>Editar</li>
               <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.push(`/students/create/${this.state.parent._id}`);
               }}>Asignar alumno</li>
               <li className="mdl-menu__item" onClick={(e) => { this.delete() }}>Eliminar</li>
             </ul>
           ]
         } />
         <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
         <div className="demo-ribbon mdl-color--teal-400" />
         <main className="demo-main mdl-layout__content">
           <div className="demo-container mdl-grid">
             <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
               <List.Parent parent={this.state.parent} />
             </div>
           </div>
           <div className="mdl-grid demo-content">
             {this.state.parent.students.map((row) => {
               return (
                 <Student key={row._id} student={row} session={this.session} delete={this.deleteStudent.bind(this)} />
               );
             })}
           </div>
         </main>
       </div>
     );
   }
 }
