import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import { App, ModalApp } from '../app'

@withRouter
 export class ParentCreate extends FormUtils<{router: any}, {}>{
   public init: boolean = false;
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
    words: {
      match: (fn: Array<any>) => {
        return fn.length > 0;
      },
      value: [],
      required: true
    }
   };
   public concept: any = {
     key: "",
     value: ""
   };
  public titles: Array<string> = [];
  state: { error: compat.Map, terms: Array<Words.Term>} = {
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
	        url: `${window._BASE}/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
	        	this.props.router.replace('/matters');
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
        this.setState({ terms: data });
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
  componentDidUpdate(){
    componentHandler.upgradeAllRegistered();
  }
  deleteItem(id: number) {
    this.fields.words.value.splice(id, 1);
    this.titles.splice(id, 1);
    this.forceUpdate();
  }
  addKey(e: React.EventHandler<any>): any {
  if (this.concept.key.trim() == "") {
    this.state.error.words = true;
    this.setState({ error: this.state.error});
    return null;
  }
  this.fields.words.value.push(this.concept.key);
  this.titles.push(this.concept.value);
  this.concept = {
    key: "",
    value: ""
  };
  this.forceUpdate();
}
   render(){
     if (!this.init) {
       return (
         <ModalApp success={(e: any) => { console.warn("Esperando") }} title="Aceptar" />
       );
     }
     return(
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir un área de aprendizaje">
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
               <textarea className="mdl-textfield__input" id="description" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="description">Descripción*</label>
               <span className="mdl-textfield__error">Es necesaria una descripción</span>
             </div>
           </div>
           <div className="mdl-cell--6-col mdl-cell--middle">
              <div className="mdl-grid">
               <div className="mdl-cell--9-col mdl-cell--middle mdl-cell--3-col-phone" style={{marginRight: "5px"}}>
                 <div className={"mdl-textfield mdl-textfield " + ((this.state.error.words) ? 'is-invalid' : '')}>
                 <label className="label static" htmlFor="regexp">Tipo de concepto</label>
                  <select className="mdl-textfield__input" id="key" onChange={(e) => {
                    this.concept.key = e.target.value;
                    this.concept.value = e.target.selectedOptions[0].label;
                    this.state.error.words = false;
                    this.setState({ error: this.state.error });
                   }} value={this.concept.key}>
                    <option value="">Seleccione una opción</option>
                    {this.state.terms.map((row: any) => {
                      return (
                        <option key={row._id} value={row._id}>{row.concept}</option>
                        
                      )
                    })}
                  </select>
                  <span className="mdl-textfield__error">Es necesario un concepto</span>
                </div>
              </div>
               <div className="mdl-cell--1-col mdl-cell--middle">
                 <button id="add-keyword" className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" onClick={this.addKey.bind(this)}>
                  <i className="material-icons">add</i>
                </button>
              </div>
            </div>
           </div>
           <div className="mdl-cell--1-col mdl-cell--middle" style={{ marginLeft: "5px" }}>
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
