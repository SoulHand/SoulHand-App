import * as React from 'react'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/parent'
import { App, ModalApp } from '../app'

@withRouter
 export class Edit extends FormUtils <Props.teacherView, compat.Map>{
   public session: User.session;
   public init: boolean = false;
   public fields:compat.Map={
 		name:{
 			value:null,
 			required:false
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
 			required:false
 		},
 		genero:{
 			value:null,
      required: true,
      match: (str: string) => {
        return !validator.isNull()(str);
      }
 		}
 	};
   state:compat.Map = {
      parent:  null,
      name: "",
      tel: "",
      birthdate:"",
      genero: "",
      error: {}
   };
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       },
     });
     p1.done((parent: People.parent) => {
       this.init = true;
       this.fields.name.value = parent.data.name;
       this.fields.birthdate.value = parent.data.birthdate;
       this.fields.tel.value = parent.data.tel;
       this.fields.genero.value = parent.data.genero;
       this.setState({
         parent: parent,
         name: parent.data.name,
         birthdate: parent.data.birthdate,
         tel: parent.data.tel,
         genero: parent.data.genero
       })
     });
   }
   getFields(event:any){
     super.getFields(event);
     this.state[event.target.id] = this.fields[event.target.id].value;
     this.setState(this.state);
   }
   getRadioButton(event:any){
     super.getRadioButton(event);
     this.state[event.target.id] = this.fields[event.target.id].value;
     this.setState(this.state);
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
     delete values.nacionality;
     ajax({
 			method:"PUT",
 	        url: `${window._BASE}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:values,
          crossDomain: true,
 	        success:(data:any)=>{
 	        	this.props.router.replace(`/parents/get/${this.props.routeParams.id}`);
          },
          beforeSend: () => {
            window.progress.start();
            _button.disabled = true;
          },
          complete: () => {
            window.progress.done();
            _button.removeAttribute("disabled");
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
   render(){
     if (!this.init) {
       return (
         <App />
       );
     }
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Editar representante">
         <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-cell--6-col mdl-cell--middle">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} value={this.state.name} />
               <label className="mdl-textfield__label" htmlFor="name">Nombre Y Apellido*</label>
               <span className="mdl-textfield__error">Es necesaria un nombre y apellido</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.tel) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="tel" id="tel" onChange={(e: any) => { this.getFields(e) }} value={this.state.tel} />
               <label className="mdl-textfield__label" htmlFor="tel">Telefono*</label>
               <span className="mdl-textfield__error">Es necesaria un telefono</span>
             </div>
           </div>
           <div className="mdl-cell--6-col mdl-cell--middle">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.birthdate) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="birthdate" pattern="^[0-9]{2}\-[0-9]{2}-[0-9]{4}$" onChange={(e: any) => { this.getFields(e) }} value={this.state.birthdate} />
               <label className="mdl-textfield__label" htmlFor="birthdate">Fecha de nacimiento*</label>
               <span className="mdl-textfield__error">Es necesaria una fecha en formato d-m-Y</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <label className="label static" htmlFor="genero">Genero*</label>
             <select className="mdl-textfield__input" id="genero" onChange={(e: any) => { this.getFields(e) }} value={this.state.genero}>
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
