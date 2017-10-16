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
 		regexp:{
        match: (fn: string) => {
          if(!fn){
            return true;
          }
          if (fn.trim() == ""){
            return true;
          }
          try{
            var regexp = new RegExp(fn, "ig");
          }catch(error){
            return false;
          }
          return true;
        },
 			value:null
    }
 	};
  state: {error: compat.Map} = {
    error:{},
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
        url: `${window._BASE}/v1/words/lexemas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
        success:(data:any)=>{
          this.props.router.replace(`/words/get/${data._id}`);
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
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
        <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir un lexema">
          <div className="mdl-grid mdl-color--white">
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
                <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
                <label className="mdl-textfield__label" htmlFor="name">Nombre*</label>
                <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.regexp) ? 'is-invalid' : '')}>
                <textarea className="mdl-textfield__input" id="regexp" onChange={(e: any) => { this.getFields(e) }} />
                <label className="mdl-textfield__label" htmlFor="regexp">Expresión regular (solo desarrolladores)</label>
                <span className="mdl-textfield__error">No se admite la expresión regular</span>
              </div>
            </div>
          </div>
        </ModalApp>
     );
   }
 }
