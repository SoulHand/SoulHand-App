import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import { ModalApp } from "../app"

@withRouter
 export class AlumnCreate extends FormUtils<{router: any, routeParams: any}, {}>{
   public activity: CRUD.activity;
   public init = false;
   state: { students: Array<People.student>, recomends: Array<People.student>} = {
     students: [],
     recomends: []
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
  send(event: any){
    var fields: Array<string> = [];
    var objetives: any = document.querySelectorAll("input[data-field]");
    var _button = event.target;
    for (var i in objetives) {
      if (objetives[i].checked == true) {
        fields.push(objetives[i].getAttribute("data-field"));
      }
    }
    ajax({
			method:"PUT",
	        url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}/student?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:{
            data: JSON.stringify(fields)
          },
          beforeSend: () => {
            window.progress.start();
            _button.disabled = true;
          },
          complete: () => {
            window.progress.done();
            _button.disabled = false;
          },
	        success:(data:any)=>{
	        	this.props.router.replace(`/activity/get/${this.props.routeParams.activity}`);
	        },
	        error:(data:any)=>{
	        	var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: 2000
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            message.MaterialSnackbar.showSnackbar(config);
	        }
		});
  }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}/students?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((rows: any) => {
      this.init = true;
       this.setState({
         students: rows[1],
         recomends: rows[0],
       })
     })
   }
   render(){
     if (!this.init) {
       return (
         <ModalApp success={(e: any) => { console.warn("Esperando") }} />
       );
     }
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title={"Asignar alumnos"}>
         <span className="mdl-typography--title">Recomendados</span>
         <ul className="demo-list-control mdl-list">
           {this.state.recomends.map((word) => {
             return (
               <li className="mdl-list__item mdl-list__item--three-line" key={word._id}>
                 <span className="mdl-list__item-primary-content">
                   <i className="material-icons  mdl-list__item-avatar">chat</i>
                   <span>{word.data.name}</span>
                   <span className="mdl-list__item-text-body">
                     {word.exp} XP
                   </span>
                 </span>
                 <span className="mdl-list__item-secondary-action">
                   <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`select-${word._id}`}>
                     <input type="checkbox" id={`select-${word._id}`} className="mdl-checkbox__input" data-field={word._id} />
                   </label>
                 </span>
               </li>
             );
           })}
         </ul>
         <span className="mdl-typography--title">Todas</span>
         <ul className="demo-list-control mdl-list">
           {this.state.students.map((word) => {
             return (
               <li className="mdl-list__item mdl-list__item--three-line" key={word._id}>
                 <span className="mdl-list__item-primary-content">
                   <i className="material-icons  mdl-list__item-avatar">chat</i>
                   <span>{word.data.name}</span>
                   <span className="mdl-list__item-text-body">
                     {word.exp} XP
                   </span>
                 </span>
                 <span className="mdl-list__item-secondary-action">
                   <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`select-${word._id}`}>
                     <input type="checkbox" id={`select-${word._id}`} className="mdl-checkbox__input" data-field={word._id} />
                   </label>
                 </span>
               </li>
             );
           })}
         </ul>
       </ModalApp>
     );
   }
 }
