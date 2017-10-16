import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import { ModalApp } from "../app"

@withRouter
 export class ParentCreate extends FormUtils<Props.GenericRouter, {}>{
   public fields:compat.Map={
 		name:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:null,
 			required:true
 		},
 		birthdate:{
 			match:(str: string) => {
        return /^[0-9]{2}\-[0-9]{2}-[0-9]{4}$/.test(str);
      },
 			value:null,
 			required:true
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
    values.parent = this.props.routeParams.id;
    ajax({
			method:"POST",
	        url: `${window._BASE}/v1/people/students/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
            this.props.router.replace(`/parents/get/${this.props.routeParams.id}`);
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
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir un alumno">
         <div className="mdl-grid mdl-color--white">
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="name">Nombre y Apellido*</label>
               <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
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
         </div>
       </ModalApp>
     );
   }
 }
