import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp } from "../app"
import {ajax} from 'jquery'

@withRouter
export class ParentCreate extends FormUtils<Props.objetiveView, {}>{
   public fields:compat.Map={
 		age:{
 			match:validator.isFloat(),
 			value:null,
 			required:true
 		},
 		min:{
       match:validator.isFloat(),
       value:null,
       required:true
    },
    max:{
       match:validator.isFloat(),
       value:null,
       required:true
    },
    genero:{
 			match:(e: string) => {
         return !validator.isNull()(e)
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
	        url: `${window._BASE}/v1/physic/static/weight/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
	        	this.props.router.replace(`/physic`);
	        },
	        error:(data:any)=>{
            var state: CRUD.codeError = data.responseJSON;
            var config = {
                message: state.message,
                timeout: 30000
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
      <ModalApp success={this.send.bind(this)} label="Aceptar" title="Añadir un peso (inferencia)">
         <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.age) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="age" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="age">Edad (años)*</label>
               <span className="mdl-textfield__error">Debe ser un numero decimal</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.min) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="min" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="min">Peso minimo (kg)*</label>
               <span className="mdl-textfield__error">Debe ser un numero decimal</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.max) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="max" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="max">Peso máximo (kg)*</label>
               <span className="mdl-textfield__error">Debe ser un numero decimal</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-textfield--floating-label " + ((this.state.error.max) ? 'is-invalid' : '')}>
               <label className="label static" htmlFor="max">Genero*</label>
               <select className="mdl-textfield__input" id="genero" onChange={(e: any) => { this.getFields(e) }}>
                 <option value="">Seleccione un genero</option>
                 <option value="MASCULINO">Masculino</option>
                 <option value="FEMENINO">Femenino</option>
               </select>
               <span className="mdl-textfield__error">Es obligatorio</span>
             </div>
           </div>
         </div>
      </ModalApp>
     );
   }
 }
