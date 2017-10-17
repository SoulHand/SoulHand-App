import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp } from "../app"
import {ajax} from 'jquery'

@withRouter
 export class ParentCreate extends FormUtils<{router: any}, {}>{
   public fields:compat.Map={
 		dni:{
 			match:validator.matches(/^[0-9]{6,11}$/i),
 			value:null,
 			required:true
 		},
 		name:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:null,
 			required:true
 		},
 		nacionality:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:'V',
 			required:true
 		},
 		tel:{
 			match:(fn:string)=>{
 				return /^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/.test(fn);
 			},
 			value:null
 		},
 		birthdate:{
 			match:(str: string) => {
        return /^[0-9]{2}\-[0-9]{2}-[0-9]{4}$/.test(str);
      },
 			value:null,
 			required:true
 		},
 		interprete:{
 			value:null
 		},
 		genero:{
 			value:null,
      required:true,
      match: (str: string) => {
        return !validator.isNull()(str);
      }
 		}
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
    values.dni = values.nacionality + values.dni;
    delete values.nacionality;
    ajax({
			method:"POST",
	        url: `${window._BASE}/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
	        	this.props.router.replace('/teachers');
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
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir un docente">
         <div className="mdl-grid mdl-color--white">
           <div className="mdl-cell mdl-cell--6-col">
             <div className="mdl-grid">
               <div className="mdl-cell mdl-cell--2-col">
                 <div className={"mdl-textfield mdl-js-textfield " + ((this.state.error.dni) ? 'is-invalid' : '')}>
                   <select className="mdl-textfield__input" id="nacionality" onChange={(e: any) => { this.getFields(e) }}>
                     <option value="V">V</option>
                     <option value="E">E</option>
                   </select>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--4-col">
                 <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.dni) ? 'is-invalid' : '')}>
                   <input className="mdl-textfield__input" type="text" id="dni" pattern="^[0-9]{5,11}$" onChange={(e: any) => { this.getFields(e) }} />
                   <label className="mdl-textfield__label" htmlFor="dni">Cedula*</label>
                   <span className="mdl-textfield__error">Es necesaria un cedula valida</span>
                 </div>
               </div>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="name">Nombre y Apellido*</label>
               <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.tel) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="tel" id="tel" pattern='^[+]?([\\d]{0,3})?[\\(\\.\\-\\s]?(([\\d]{1,3})[\\)\\.\\-\\s]*)?(([\\d]{3,5})[\\.\\-\\s]?([\\d]{4})|([\\d]{2}[\\.\\-\\s]?){4})$' onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="tel">Telefono*</label>
               <span className="mdl-textfield__error">Es necesaria un telefono</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.birthdate) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="birthdate" pattern="^[0-9]{2}\-[0-9]{2}-[0-9]{4}$" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="birthdate">Fecha de nacimiento*</label>
               <span className="mdl-textfield__error">Es necesaria una fecha en formato d-m-Y</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <label className="label static" htmlFor="genero">Genero*</label>
             <select className="mdl-textfield__input" id="genero" onChange={(e: any) => { this.getFields(e) }}>
               <option value="">Seleccione una opción</option>
               <option value="MASCULINO">MASCULINO</option>
               <option value="FEMENINO">FEMENINO</option>
             </select>
             {(this.state.error.genero) && (
               <span style={{ color: "rgb(222, 50, 38)" }}>Seleccione un genero</span>
             )}
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <label htmlFor="interprete" className="label static">
               Interprete
                  </label>
             <label htmlFor="interprete" className="mdl-switch mdl-js-switch">
               <input type="checkbox" id="interprete" className="mdl-switch__input" onChange={(e: any) => { this.getRadioButton(e) }} />
               <span className="mdl-switch__label">No/Si</span>
             </label>
           </div>
         </div>
       </ModalApp>
     );
   }
 }
