import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../../formutils'
import {ajax} from 'jquery'


@withRouter
 export class ParentCreate extends FormUtils<{router: any}, any>{
   public fields:compat.Map={
 		name:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:null,
 			required:true
 		},
 		term:{
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
 			value:null,
 			required:true
 		},
 		words:{
 			value:null,
 			required:true
 		} 		
 	};
   state: { error: compat.Map, terms: any} = {
    error:{},
    terms: null
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
        method:"POST",
        url: `${window._BASE}/v1/words/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data:values,
        success:(data:any)=>{
          this.props.router.replace('/words/words');
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
  componentDidMount() {
    let p1 = ajax({
      method: "GET",
      url: `${window._BASE}/v1/terms/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null
    });
    p1.done((lexema: any) => {
      this.setState({ terms: lexema});
    });
  }
  componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
  }
  render(){
    if(!this.state.terms){
      return null;
    }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/words/words"><i className="material-icons">&#xE5C4;</i></Link></div>
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
                  <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.name) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="name" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="name">Nombre*</label>
                   <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
                  <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.name) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="description" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="description">Definición*</label>
                   <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
                <label className="label static" htmlFor="term">Tipo de concepto</label>
                <select className="mdl-textfield__input" id="term" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {this.state.terms.map((row: any) => {
                    return (
                      <option key={row._id} value={row._id}>{row.concept}</option>
                    );
                  })}
                </select>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
                  <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.name) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="words" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="words">Sinonimos(valido separadores)*</label>
                   <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
                 </div>
               </div>
          </div>
          </main>
       </div>
     );
   }
 }
