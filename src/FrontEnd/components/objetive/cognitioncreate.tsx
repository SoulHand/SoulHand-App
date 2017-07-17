import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'

@withRouter
 export class CognitionCreate extends FormUtils<{router: any, routeParams: any}, {}>{
   public activity: CRUD.objetive;
   state: {objetives: Array<CRUD.cognition>} = {
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
       data:null
     });
     let p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/cognitions/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done()]).then((rows: any) => {
       this.activity = rows[0];
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
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to={`/objetives/get/${this.props.routeParams.id}`}><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" onClick={(e:any)=>{this.send(e)}}>
             <i className="material-icons">check</i>
           </button>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
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
          </main>
       </div>
     );
   }
 }
