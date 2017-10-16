import * as React from 'react'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Teacher} from '../cards/teacher'
import * as List from '../profiles/teacher'
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
 		},
 		grade:{
 			value:null,
      required: true,
      match: (str: string) => {
        return !validator.isNull()(str);
      }
 		}
 	};
   state:compat.Map = {
      student:  null,
      name: "",
      birthdate:"",
      genero: "",
      grade:"",
      error: {},
      grades:[]
   };
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
      window.progress.start();
      let p1 = ajax({
        method:"GET",
        url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data:null
      });
      let p2 = ajax({
        method:"GET",
        url: `${window._BASE}/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data:null
      });
      
      window.Promise.all([p1.done(), p2.done()])
      .then((data: any) => {
        window.progress.done();
        this.init = true;
       let student: People.student = data[0];
       let grades: Array<CRUD.grade> = data[1];
       this.fields.name.value = student.data.name;
       this.fields.birthdate.value = student.data.birthdate;
       this.fields.genero.value = student.data.genero;
       this.setState({
         student: student,
         name: student.data.name,
         birthdate: student.data.birthdate,
         genero: student.data.genero,
         grades: grades
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
 	        url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:values,
          crossDomain: true,
 	        success:(data:any)=>{
 	        	this.props.router.replace(`/students/get/${this.props.routeParams.id}`);
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
     if(!this.init){
       return (
         <App/>
       );
     }
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir un grado">
         <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-cell--6-col mdl-cell--middle">
             <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
               <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} value={this.state.name} />
               <label className="mdl-textfield__label" htmlFor="name">Nombre Y Apellido*</label>
               <span className="mdl-textfield__error">Es necesaria un nombre y apellido</span>
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
           <div className="mdl-cell mdl-cell--6-col">
             <label className="label static" htmlFor="grade">Grados*</label>
             <select className="mdl-textfield__input" id="grade" onChange={(e: any) => { this.getFields(e) }} value={this.state.grade}>
               <option value="">Seleccione una opción</option>
               {this.state.grades.map((row: CRUD.grade) => {
                 if (this.state.student.grade && this.state.student.grade._id == row._id) {
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
