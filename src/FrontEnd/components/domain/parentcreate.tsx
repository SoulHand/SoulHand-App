import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp } from "../app"
import {ajax} from 'jquery'

@withRouter
 export class ParentCreate extends FormUtils<{router: any}, {}>{
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
	        	this.props.router.replace(`/objetives/get/${data._id}`);
	        },
	        error:(data:any)=>{
            var state: CRUD.codeError = data.responseJSON;
            if (state.code == "152") {
              this.setState({error: state.message});
              this.show();
            }else{
              var config = {
                message: state.message,
                timeout: 2000
              };
              var message: any = document.querySelector('.mdl-js-snackbar')
              message.MaterialSnackbar.showSnackbar(config);
            }
	        }
		});
  }
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
      <ModalApp success={this.send.bind(this)} title="Aceptar">
         <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="name">Nombre del objetivo*</label>
               <span className="mdl-textfield__error">Es necesaria un nombre valido con un verbo infinitivo</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <textarea className="mdl-textfield__input" type="text" id="description" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="description">Descripción del objetivo*</label>
               <span className="mdl-textfield__error">Es necesaria una descripción valida</span>
             </div>
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
