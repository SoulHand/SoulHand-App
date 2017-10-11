import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp } from "../app"
import {ajax} from 'jquery'

@withRouter
 export class ParentCreate extends FormUtils<{router: any, routeParams: any}, {}>{
   public activity: CRUD.activity;
   state: {objetives: Array<CRUD.objetive>} = {
     objetives: []
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
  send(event: any){
    var fields: Array<string> = [];
    var objetives: any = document.querySelectorAll("tr[id] input[type='checkbox']");
    for (var i in objetives){
      if (objetives[i].checked == true) {
        var parent: any = objetives[i].parentNode.parentNode.parentNode;
        fields.push(parent.id);
      }
    }
    ajax({
			method:"PUT",
	        url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}/objetives?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:{
            data: JSON.stringify(fields)
          },
	        success:(data:any)=>{
	        	this.props.router.replace(`/activity/get/${this.props.routeParams.activity}`);
	        },
	        error:(data:any)=>{
	        	var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: 300000
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
       data:null
     });
     let p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/objetives?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done()]).then((rows: any) => {
       this.activity = rows[0];
        let objetives: Array<CRUD.objetive> = rows[1];
        objetives = objetives.filter((row) => {
          for ( var i in this.activity.objetives){
            if(this.activity.objetives[i]._id == row._id) {
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
     return(
        <ModalApp success={this.send.bind(this)} title="Aceptar">
         <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable resize">
           <thead>
             <tr>
               <th className="mdl-data-table__cell--non-numeric">Objetivo</th>
               <th>Dominio</th>
               <th>Nivel</th>
             </tr>
           </thead>
           <tbody>
             {
               this.state.objetives.map((row) => {
                 if (!row.domain || !row.level) {
                   return null;
                 }
                 return (
                   <tr key={row._id} id={row._id}>
                     <td className="mdl-data-table__cell--non-numeric" title={row.name}><span>{row.name}</span></td>
                     <td title={row.domain.name}><span>{row.domain.name}</span></td>
                     <td title={row.level.name}><span>{row.level.name}</span></td>
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
