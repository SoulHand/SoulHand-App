import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp } from "../app"
import {ajax} from 'jquery'

@withRouter
export class ParentCreate extends FormUtils<Props.objetiveView, {}>{
   public fields:compat.Map={
 		name:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:null,
 			required:true
 		},
 		description:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:null,
 			required:true
 		},
 		words:{
 			value:null,
 			required:true
 		},
 		is_correct:{
      value:false,
      required:true
    },
    is_observable:{
 			value:false,
 			required:true
 		}
 	};
  state: {error: compat.Map} = {
    error:{
      error: null,
      words: []
    }
  }
  show() {
    var modal: any = document.getElementById("confirm-error");
    if (!modal.showModal) {
      window.dialogPolyfill.registerDialog(modal);
    }
    modal.showModal();
  }
  hiden() {
    var modal: any = document.getElementById("confirm-error");
    if (!modal.showModal) {
    }
    window.dialogPolyfill.registerDialog(modal);
    modal.close();
  }
  send(event: any){
    var values: compat.Map = {};
    var error = false;
    var _button = event.target;
    for(var i in this.fields){
      this.state.error[i] = !super.validate(this.fields[i].value, i);
      values[i] = this.fields[i].value;
      error = error || this.state.error[i];
    }
    this.setState(this.state);
    if (error) {
      return;
    }
    values.domain = this.props.routeParams.domain;
    values.level = this.props.routeParams.level;
    values.is_correct = !!values.is_correct;
    values.is_observable = !!values.is_observable;
    ajax({
			method:"POST",
	        url: `${window._BASE}/v1/knowedge/objetives/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
          data:values,
          beforeSend: () => {
            window.progress.start();
            _button.disabled = true;
          },
          complete: () => {
            window.progress.done();
            _button.disabled = false;
          },
	        success:(data: CRUD.objetive)=>{
            var str = sessionStorage.getItem("words-pending");
            var _words: Array<string> = [];
            if (str) {
              _words = JSON.parse(str);
            }
            _words = _words.concat(data.pending);
            sessionStorage.setItem("word-pending", JSON.stringify(_words));
            sessionStorage.removeItem("error");
	        	this.props.router.replace(`/objetives/get/${data._id}`);
	        },
	        error:(data:any)=>{
            var state: CRUD.codeError = data.responseJSON;
            var str = sessionStorage.getItem("words-pending");
            var _words: Array<string> = [];
            if (str) {
              _words = JSON.parse(str);
            }
            _words = _words.concat(state.message.keywords);
            sessionStorage.setItem("word-pending", JSON.stringify(_words));
            sessionStorage.removeItem("error");
            var config = {
              message: state.message.message,
              timeout: window.settings.alert.delay
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            message.MaterialSnackbar.showSnackbar(config);
            if (state.code == "153") {
              this.props.router.replace(`/errors/1/words/new`);            
            }
	        }
		});
  }
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
      <ModalApp success={this.send.bind(this)} label="Aceptar" title="Añadir un objetivo (Modo experto)">
         <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="name">Nombre del objetivo*</label>
               <span className="mdl-textfield__error">Es necesaria un nombre valido con un verbo infinitivo</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
               <textarea className="mdl-textfield__input" type="text" id="description" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="description">Descripción del objetivo*</label>
               <span className="mdl-textfield__error">Es necesaria una descripción valida</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
              <label htmlFor="interprete" className="label static">
                ¿Verbos observables?
              </label>
              <label htmlFor="is_observable" className="mdl-switch mdl-js-switch">
               <input type="checkbox" id="is_observable" className="mdl-switch__input" onChange={(e: any) => { this.getRadioButton(e) }} />
               <span className="mdl-switch__label">No/Si</span>
             </label>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.words) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="words" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="words">Palabras claves</label>
               <span className="mdl-textfield__error">Las palabras deben poseer un separador</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
              <label htmlFor="interprete" className="label static">
                ¿Palabras claves correctas?
              </label>
              <label htmlFor="is_correct" className="mdl-switch mdl-js-switch">
               <input type="checkbox" id="is_correct" className="mdl-switch__input" onChange={(e: any) => { this.getRadioButton(e) }} />
               <span className="mdl-switch__label">No/Si</span>
             </label>
           </div>
         </div>
         <dialog className="mdl-dialog" id="confirm-error" key="confirm-error">
             <div className="mdl-dialog__content mdl-dialog__actions--full-width">
               <h5>Lo sentimos</h5>
               <p>{this.state.error.error}</p>
               <p>No se lograron identificar {this.state.error.words.length} palabras puede contribuir a mejorar el conocimiento.</p>
             </div>
             <div className="mdl-dialog__actions">
               <button type="submit" className="mdl-button open">Acepto</button>
               <button type="button" className="mdl-button close" onClick={this.hiden.bind(this)}>No estoy de acuerdo</button>
             </div>
         </dialog>
      </ModalApp>
     );
   }
 }
