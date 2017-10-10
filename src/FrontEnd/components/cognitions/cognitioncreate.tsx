import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import { ModalApp} from "../app"
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'

@withRouter
 export class CognitionCreate extends FormUtils<{router: any}, any>{
   public init = false;
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
 			match:(fn:Array<any>)=>{
 				return fn.length > 0;
      },
      value: [],
 			required:true
 		}
  };
  public concept: any = {
    key: "",
    value: ""
  };
  public titles: Array<string> = [];
  state: {error: compat.Map, terms: any} = {
    error:{},
    terms: []
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
    values.words = JSON.stringify(values.words);
    ajax({
      method:"POST",
          url: `${window._BASE}/v1/knowedge/cognitions/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
	        success:(data: CRUD.domain)=>{
	        	this.props.router.replace(`/cognitions/get/${data._id}`);
	        },
	        error:(data:any)=>{
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
  deleteItem(id: number) {
    this.fields.words.value.splice(id, 1);
    this.titles.splice(id, 1);
    this.forceUpdate();
  }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     ajax({
       method: "GET",
       url: `${window._BASE}/v1/terms/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       },
       success: (data: any) => {
         this.init = true;
         this.setState({terms: data});
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
     componentHandler.upgradeAllRegistered();
   }
   render(){
     if(!this.init){
       return (
         <ModalApp success={(e: any) => {console.warn("Esperando")}} title="Aceptar"/>
       );
     }
     return(
       <ModalApp success={(e: any) => { this.send(e) }} title="Aceptar">
           <div className="mdl-grid mdl-color--white">
              <div className="mdl-cell mdl-cell--12-col">
                <h3 className="mdl-typography--text-center display-1">Crear función cognitiva</h3>
                <p>Las funciones cognitivas permiten verbalizar acciones realizadas por el cerebro, permitiendo así medir el tiempo y frecuencia de respuesta ante ciertas actividades.</p>
              </div>
             <div className="mdl-cell mdl-cell--6-col">
               <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
                 <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
                 <label className="mdl-textfield__label" htmlFor="name">Nombre de la función cognitiva*</label>
                 <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
               </div>
             </div>
             <div className="mdl-cell mdl-cell--6-col">
               <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
                 <textarea className="mdl-textfield__input" type="text" id="description" onChange={(e: any) => { this.getFields(e) }} />
                 <label className="mdl-textfield__label" htmlFor="description">Descripción de la función*</label>
                 <span className="mdl-textfield__error">Es necesaria una descripción valida</span>
               </div>
             </div>
             <div className="mdl-cell--4-col mdl-cell--middle">
               <label className="label static" htmlFor="regexp">Tipo de concepto</label>
               <select className="mdl-textfield__input" id="key" onChange={(e) => {
                 this.concept.key = e.target.value;
                 this.concept.value = e.target.selectedOptions[0].label;
                 this.forceUpdate();
               }}>
                 <option value="">Seleccione una opción</option>
                 {this.state.terms.map((row: any) => {
                  return (
                     <option key={row._id} value={row._id}>{row.concept}</option>

                  )
                 })}
               </select>
             </div>
             <div className="mdl-cell--1-col mdl-cell--middle" style={{ marginLeft: "5px" }}>
               <button id="add-keyword" className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onClick={(e) => {
                if (this.concept.key.trim() == ""){
                  return null;
                }
                this.fields.words.value.push(this.concept.key);
                this.titles.push(this.concept.value);
                this.concept = {
                  key: "",
                  value: ""
                };
                this.forceUpdate();
               }}>
                 <i className="material-icons">add</i>
               </button>
               <div className="mdl-tooltip" data-mdl-for="add-keyword">
                 Añadir una palabra clave
              </div>
             </div>
             <div className="mdl-cell--12-col mdl-cell--middle">
               {this.fields.words.value.map((row: any, index: number) => {
                 return (
                   <span className="mdl-chip" key={row}>
                     <span className="mdl-chip__text">{this.titles[index]}</span>
                     <button type="button" className="mdl-chip__action" onClick={this.deleteItem.bind(this, index)}><i className="material-icons">cancel</i></button>
                   </span>
                 );
               })}
             </div>
           </div>
       </ModalApp>
     );
   }
 }