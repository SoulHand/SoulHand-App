import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../../formutils'
import {ajax} from 'jquery'

@withRouter
 export class Create extends FormUtils<Props.GenericRouter, {}>{
   public fields:compat.Map={
 		height:{
 			match:validator.isFloat(),
 			value:null,
 			required:true
 		},
 		weight:{
 			match:validator.isFloat(),
 			value:null,
 			required:true
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
    values.parent = this.props.routeParams.id;
    console.log(values, this.props.routeParams);
    ajax({
			method:"POST",
	        url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}/physic/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:values,
	        success:(data:any)=>{
	        	this.props.router.replace(`/students/get/${this.props.routeParams.id}/physic`);
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
        <div className="mdl-layout__drawer-button"><Link to={`/students/get/${this.props.routeParams.id}/physic`}><i className="material-icons">&#xE5C4;</i></Link></div>
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
                  <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.weight) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="number" id="weight" onChange={(e:any)=>{this.getFields(e)}} min={0} max={285}/>
                   <label className="mdl-textfield__label" htmlFor="weight">Peso(kg)*</label>
                   <span className="mdl-textfield__error">Es necesaria un peso valido</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
                <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.height) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="number" id="height" onChange={(e:any)=>{this.getFields(e)}} min={0}/>
                   <label className="mdl-textfield__label" htmlFor="height">Altura(cm)*</label>
                   <span className="mdl-textfield__error">Es necesario una altura valida</span>
                 </div>
               </div>
             </div>
          </main>
       </div>
     );
   }
 }
