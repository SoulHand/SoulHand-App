import * as React from 'react'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Teacher} from '../cards/teacher'
import * as List from '../profiles/teacher'
import { App, ModalApp } from '../app'

@withRouter
 export class SetGrade extends FormUtils <Props.teacherView, compat.Map>{
   public session: User.session;
   public init: boolean = false;
   public fields:compat.Map={
 		grade:{
 			value:null,
      required: true,
      match: (str: string) => {
        return !validator.isNull()(str);
      }
 		}
 	};
   state:compat.Map = {
      grade: "",
      error:{},
      grades:[]
   };
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     window.progress.start();
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     let p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done()]).then((data: any) => {
       window.progress.done();
       let teacher: People.teacher = data[0];
       let grades: Array<CRUD.grade> = data[1];
       this.init = true;
       this.setState({
         teacher: teacher,
         grades: grades,
         grade: (teacher.grade) ? teacher.grade._id : null
       })
     });
   }
   getFields(event:any){
     super.getFields(event);
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
 	        url: `${window._BASE}/v1/people/teachers/${this.props.routeParams.id}/grade/${values.grade}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:values,
          crossDomain: true,
          beforeSend: () => {
            window.progress.start();
            _button.disabled = true;
          },
          complete: () => {
            window.progress.done();
            _button.removeAttribute("disabled");
          },
 	        success:(data:any)=>{
 	        	this.props.router.replace(`/teachers/get/${this.props.routeParams.id}`);
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
   render(){
     if (!this.init) {
       return (
         <App />
       );
     }
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Editar docente">
         <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-cell mdl-cell--6-col">
             <label className="label static" htmlFor="grade">Grados*</label>
             <select className="mdl-textfield__input" id="grade" onChange={(e: any) => { this.getFields(e) }} value={this.state.grade}>
               <option value="">Seleccione una opción</option>
               {this.state.grades.map((row: CRUD.grade) => {
                 if (this.state.teacher.grade && this.state.teacher.grade._id == row._id) {
                   return (
                     <option value={row._id} key={row._id} selected>{row.name}</option>
                   );
                 }
                 return (
                   <option value={row._id} key={row._id}>{row.name}</option>
                 );
               })}
             </select>
             {(this.state.error.genero) && (
               <span style={{ color: "rgb(222, 50, 38)" }}>Seleccione un grado</span>
             )}
           </div>
         </div>
       </ModalApp>
     );
   }
 }
