import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import { ModalApp } from "../app"

@withRouter
 export class AlumnCreate extends FormUtils<{router: any, routeParams: any}, {}>{
   public activity: CRUD.activity;
   public init = false;
   state: {students: Array<People.student>} = {
     students: []
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
  send(event: any){
    var fields: Array<string> = [];
    var students: any = document.querySelectorAll("tr[id] input[type='checkbox']");
    var _button = event.target;
    for (var i in students){
      if (students[i].checked == true) {
        var parent: any = students[i].parentNode.parentNode.parentNode;
        fields.push(parent.id);
      }
    }
    ajax({
			method:"PUT",
	        url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}/student?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:{
            data: JSON.stringify(fields)
          },
          beforeSend: () => {
            window.progress.start();
            _button.disabled = true;
          },
          complete: () => {
            window.progress.done();
            _button.disabled = false;
          },
	        success:(data:any)=>{
	        	this.props.router.replace(`/activity/get/${this.props.routeParams.activity}`);
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
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done().then((row: CRUD.activity) => {
       this.activity = row;
       this.init = true;
       return ajax({
         method:"GET",
         url: `${window._BASE}/v1/people/students/grade/${row.grade._id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
         dataType: "json",
         data:null
       }).done();
     }).then((row: Array<People.student>) => {
       let students = row.filter((row) => {
         for ( var i in this.activity.students){
           if(this.activity.students[i]._id == row._id) {
             return false;
           }
         }
         return true;
       })
       this.setState({
         students: students
       })
     })
   }
   render(){
     if (!this.init) {
       return (
         <ModalApp success={(e: any) => { console.warn("Esperando") }} />
       );
     }
     return (
       <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title={"Asignar funciones cognitivas objetivo " + this.activity.name}>
         <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable resize">
           <thead>
             <tr>
               <th className="mdl-data-table__cell--non-numeric">codigo escolar</th>
               <th>Nombre y apellido</th>
             </tr>
           </thead>
           <tbody>
             {
               this.state.students.map((row) => {
                 return (
                   <tr key={row._id} id={row._id}>
                     <td className="mdl-data-table__cell--non-numeric" title={row.data.dni}><span>{row.data.dni}</span></td>
                     <td title={row.data.name} className="mdl-data-table__cell--non-numeric"><span>{row.data.name}</span></td>
                   </tr>
                 );
               })
             }
           </tbody>
         </table>
       </ModalApp>
     );
   }
 }
