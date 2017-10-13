import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp } from "../app"
import {ajax} from 'jquery'

@withRouter
 export class CognitionCreate extends FormUtils<{router: any, routeParams: any}, {}>{
   public activity: CRUD.objetive;
   public init = false;
   state: {objetives: Array<CRUD.cognition>} = {
     objetives: []
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
  send(event: any){
    var fields: Array<string> = [];
    var objetives: any = document.querySelectorAll("tr[id] input[type='checkbox']");
    var _button = event.target;
    for (var i in objetives){
      if (objetives[i].checked == true) {
        var parent: any = objetives[i].parentNode.parentNode.parentNode;
        fields.push(parent.id);
      }
    }
    ajax({
			method:"PUT",
	        url: `${window._BASE}/v1/knowedge/objetives/${this.props.routeParams.id}/cognitions?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
       url: `${window._BASE}/v1/knowedge/objetives/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     let p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/cognitions/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     window.Promise.all([p1.done(), p2.done()]).then((rows: any) => {
       this.activity = rows[0];
       this.init = true;
        let objetives: Array<CRUD.cognition> = rows[1];
        objetives = objetives.filter((row) => {
          for ( var i in this.activity.cognitions){
            if(this.activity.cognitions[i]._id == row._id) {
              return false;
            }
          }
          return true;
        })
        this.setState({
          objetives: objetives
        })
     })
   }
   render(){
     console.log(this.state.objetives);
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
               <th className="mdl-data-table__cell--non-numeric">Funcion cognitiva</th>
               <th>Descripción</th>
             </tr>
           </thead>
           <tbody>
             {
               this.state.objetives.map((row) => {
                 return (
                   <tr key={row._id} id={row._id}>
                     <td className="mdl-data-table__cell--non-numeric" title={row.name}><span>{row.name}</span></td>
                     <td title={row.description}><span>{row.description}</span></td>
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
