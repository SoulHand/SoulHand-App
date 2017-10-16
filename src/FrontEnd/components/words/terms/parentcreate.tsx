import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../../formutils'
import {ajax} from 'jquery'
import { App, ModalApp } from '../../app'


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
        url: `${window._BASE}/v1/terms/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data:values,
        beforeSend: () => {
          window.progress.start();
          _button.disabled = true;
        },
        complete: () => {
          window.progress.done();
          _button.removeAttribute("disabled");
        },
        success:(data:any)=>{
          this.props.router.replace(`/terms/get/${data._id}`);
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
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir una categoría gramatical">
         <div className="mdl-grid mdl-color--white">
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="name">Nombre*</label>
               <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
               <textarea className="mdl-textfield__input" type="text" id="description" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="description">Descripción*</label>
               <span className="mdl-textfield__error">Es necesaria una descripción</span>
             </div>
           </div>
         </div>
       </ModalApp>
     );
   }
 }
