import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp } from "../app"
import {ajax} from 'jquery'

@withRouter
export class CreateObjetive extends FormUtils<Props.objetiveView, {}>{
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
            if(state.code != "153"){
              var _report = {
                words: window.WORDS.SeparatorWords(values.description),
                error:{
                  code: state.code,
                  message: state.message.message
                },
                datas: values
              }
              sessionStorage.setItem("objetive-pending", JSON.stringify(_report));
              sessionStorage.removeItem("error-objetive");
            }
            var config = {
              message: state.message.message,
              timeout: window.settings.alert.delay
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            message.MaterialSnackbar.showSnackbar(config);
            if (_words.length > 0) {
              this.props.router.push(`/errors/1/words/new`);
            }
	        }
		});
  }
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
      <ModalApp success={this.send.bind(this)} label="Aceptar" title="Añadir un objetivo">
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
         </div>
      </ModalApp>
     );
   }
 }
