import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp, ModalFree } from '../app'
import {ajax} from 'jquery'

@withRouter
 export class ParentCreate extends FormUtils<{router: any, routeParams: any}, {}>{
   public activity: CRUD.activity;
   public init: boolean = false;
   state: {objetives: Array<CRUD.objetive>} = {
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
	        url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}/objetives?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
            _button.removeAttribute("disabled");
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
       url: `${window._BASE}/v1/knowedge/objetives?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done()]).then((rows: any) => {
       this.activity = rows[0];
        let objetives: Array<CRUD.objetive> = rows[1];
        this.init  = true;
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
     if (!this.init) {
       return (
         <ModalFree/>
       );
     }
     return(
        <ModalApp success={this.send.bind(this)} label="Aceptar" title="Asignar objetivos de aprendizaje">
          <table className="mdl-data-table mdl-js-data-table mdl-data-table--selectable resize">
            <thead>
              <tr>
                <th className="mdl-data-table__cell--non-numeric">Nombre</th>
                <th>Dominio</th>
                <th>Nivel</th>
              </tr>
            </thead>
            <tbody>
              {
               this.state.objetives.map((row) => {
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
