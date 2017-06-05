import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../../formutils'
import {ajax} from 'jquery'

@withRouter
 export class CompleteObjetive extends FormUtils<Props.GenericRouter, {}>{
   public fields:compat.Map={
 		description:{
 			match:(str: string) => {
        return !validator.isNull()(str);
      },
 			value:null,
 			required:true
 		},
 		completed:{
 			value:false,
 			required:false
 		},

 	};
  state: {error: compat.Map} = {
    error:{}
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
    ajax({
          method:"PUT",
	        url: `${window._BASE}/v1/people/students/${this.props.routeParams.student}/activity/${this.props.routeParams.activity}/objetive/${this.props.routeParams.objetive}/complete?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:values,
	        success:(data:any)=>{
	        	this.props.router.replace(`/activity/get/${this.props.routeParams.activity}/student/${this.props.routeParams.student}`);
	        },
	        error:(data:any)=>{
	        	var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: 2000
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            console.log(message);
            message.MaterialSnackbar.showSnackbar(config);
	        }
		});
  }
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to={`/activity/get/${this.props.routeParams.activity}/student/${this.props.routeParams.student}`}><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" onClick={(e:any)=>{this.send(e)}}>
             <i className="material-icons">check</i>
           </button>

         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid mdl-color--white demo-content">
               <div className="mdl-cell mdl-cell--6-col">
                  <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.description) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="description" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="description">Descripción*</label>
                   <span className="mdl-textfield__error">Es necesario una descripción</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
                  <label htmlFor="completed" className="label static">
                    Completado
                  </label>
                 <label htmlFor="completed" className="mdl-switch mdl-js-switch">
                   <input type="checkbox" id="completed" className="mdl-switch__input" onChange={(e:any)=>{this.getRadioButton(e)}} value="true"/>
                   <span className="mdl-switch__label">No/Si</span>
                </label>
               </div>
             </div>
          </main>
       </div>
     );
   }
 }
