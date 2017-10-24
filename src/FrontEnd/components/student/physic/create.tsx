import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../../formutils'
import {ajax} from 'jquery'
import { App, ModalApp } from '../../app'

@withRouter
 export class Create extends FormUtils<Props.GenericRouter, {}>{
   public fields:compat.Map={
 		height:{
 			match:validator.isFloat(),
 			value:null,
 			required:true
 		},
 		weight:{
 			match:validator.isFloat(),
 			value:null,
 			required:true
 		},

 	};
  state: {error: compat.Map} = {
    error:{}
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
    values.parent = this.props.routeParams.id;
    console.log(values, this.props.routeParams);
    ajax({
			method:"POST",
	        url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}/physic/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
	        	this.props.router.replace(`/students/get/${this.props.routeParams.id}`);
	        },
          error: (data: any) => {
            var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: window.settings.alert.delay
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
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir un registro (desarrollo físico)">
         <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.weight) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="weight" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="weight">Peso(kg)*</label>
               <span className="mdl-textfield__error">Es necesaria un peso valido</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.height) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="height" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="height">Altura(cm)*</label>
               <span className="mdl-textfield__error">Es necesario una altura valida</span>
             </div>
           </div>
         </div>
       </ModalApp>
     );
   }
 }
