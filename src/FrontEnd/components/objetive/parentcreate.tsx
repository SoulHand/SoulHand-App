import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp, ModalFree } from '../app'
import {ajax} from 'jquery'

@withRouter
 export class ParentCreate extends FormUtils<{router: any, routeParams: any}, {}>{
   public activity: CRUD.activity;
   public init: boolean = false;
   state: { objetives: Array<CRUD.objetive>, recomends: Array<CRUD.objetive>} = {
     objetives: [],
     recomends: []
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
  send(event: any){
    var fields: Array<string> = [];
    var objetives: any = document.querySelectorAll("input[data-field]");
    var _button = event.target;
    for (var i in objetives){
      if (objetives[i].checked == true) {
        fields.push(objetives[i].getAttribute("data-field"));
      }
    }
    ajax({
			method:"PUT",
	        url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}/objetives?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
            _button.removeAttribute("disabled");
          },
	        success:(data:any)=>{
	        	this.props.router.replace(`/activity/get/${this.props.routeParams.activity}`);
	        },
	        error:(data:any)=>{
	        	var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: 300000
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            message.MaterialSnackbar.showSnackbar(config);
	        }
		});
  }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     let p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}/objetives?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done()]).then((rows: any) => {
       this.activity = rows[0];
        let objetives: Array<CRUD.objetive> = rows[1];
        this.init  = true;
        this.setState({
          objetives: objetives[1],
          recomends: objetives[0]
        })
     })
   }
   render(){
     if (!this.init) {
       return (
         <ModalFree/>
       );
     }
     return(
        <ModalApp success={this.send.bind(this)} label="Aceptar" title="Asignar objetivos de aprendizaje">
          <span className="mdl-typography--title">Recomendados</span>
          <ul className="demo-list-control mdl-list">
            {this.state.recomends.map((word) => {
              return (
                <li className="mdl-list__item mdl-list__item--three-line" key={word._id}>
                  <span className="mdl-list__item-primary-content">
                    <i className="material-icons  mdl-list__item-avatar">chat</i>
                    <span>{word.name}</span>
                    <span className="mdl-list__item-text-body">
                      {word.description}
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
            {this.state.objetives.map((word) => {
              return (
                <li className="mdl-list__item mdl-list__item--three-line" key={word._id}>
                  <span className="mdl-list__item-primary-content">
                    <i className="material-icons  mdl-list__item-avatar">chat</i>
                    <span>{word.name}</span>
                    <span className="mdl-list__item-text-body">
                      {word.description}
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
