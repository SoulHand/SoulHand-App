import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import { ModalApp , ModalFree} from "../app"
import * as MaterialDateTimePicker from 'material-datetime-picker'
import * as moment from 'moment'


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
 			value:null
 		},
 		expire:{
 			match:(str: string) => {
        return /^[0-9]{2}\-[0-9]{2}-[0-9]{4} [0-9]{2}\:[0-9]{2}\:[0-9]{2}$/.test(str);
      },
 			value:null,
 			required:true
 		},
 		course:{
 			value:null,
      required:true,
      match: (str: string) => {
        return !validator.isNull()(str);
      }
 		}
 	};
  state: {error: compat.Map, courses: Array<CRUD.course>} = {
    error:{},
    courses:[]
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
    values.expire = values.expire.replace(/([0-9]{2})\-([0-9]{2})\-([0-9]{4})/ig,"$3-$2-$1")
    ajax({
        method:"POST",
        url: `${window._BASE}/v1/activities/${values.course}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
          this.props.router.replace('/activity');
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
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
     const input: any = document.querySelector('.c-datepicker-input');
     var now = moment();
     //input.value = now.format("DD-MM-YYYY HH:mm:ss");
     const picker = new MaterialDateTimePicker()
       .on('submit', (val: any) => {
         input.value = val.format("DD-MM-YYYY HH:mm:ss");
         this.fields.expire.value = input.value;
       });
     input.addEventListener('focus', function () {
       this.blur();
       picker.open();
     });
   }
   componentDidMount(){
     let p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       },
     });
     p2.done((rows: Array<CRUD.course>) => {
       this.init = true;
        this.setState({
          courses: rows
        })
     });
   }
   render(){
     if(!this.init){
       return (<ModalFree/>);
     }
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir una actividad">
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
           <div className="mdl-cell mdl-cell--6-col">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.expire) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input c-datepicker-input" type="text" id="expire" pattern="^[0-9]{2}\-[0-9]{2}-[0-9]{4} [0-9]{2}\:[0-9]{2}\:[0-9]{2}$" onChange={(e: any) => { this.getFields(e) }} />
               <label className="mdl-textfield__label" htmlFor="expire">Fecha de expiración*</label>
               <span className="mdl-textfield__error">Es necesaria una fecha en formato d-m-Y</span>
             </div>
           </div>
           <div className="mdl-cell mdl-cell--6-col">
             <label className="label static" htmlFor="course">Materia*</label>
             <select className="mdl-textfield__input" id="course" onChange={(e: any) => { this.getFields(e) }}>
               <option value="">Seleccione una opción</option>
               {this.state.courses.map((row) => {
                 return (
                   <option value={row.name} key={row._id}>{row.name}</option>
                 );
               })}
             </select>
             {(this.state.error.course) && (
               <span style={{ color: "rgb(222, 50, 38)" }}>Seleccione una materia</span>
             )}
           </div>
         </div>
       </ModalApp>
     );
 }
