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
 			match:(fn:Array<string>)=>{
 				return fn.length > 0;
 			},
      value:[],
      labels:[],
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
   public term: string = "";
   public label: string = "";
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
    if (error) {
      this.setState(this.state);
      return;
    }
    values.term = JSON.stringify(values.term);
    console.log(values);
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
  deleteItem(id: number) {
    this.fields.term.value.splice(id, 1);
    this.fields.term.labels.splice(id, 1);
    this.forceUpdate();
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
                  <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.name) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="words" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="words">Sinonimos(valido separadores)*</label>
                   <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
                 </div>
               </div>
               <div className="mdl-cell--4-col mdl-cell--middle">
                <label className="label static" htmlFor="term">Categoria contextual</label>
                <select className="mdl-textfield__input" id="term" onChange={(e) => {
                  this.term = e.target.value;
                  this.label = e.target.selectedOptions[0].label;
                  this.forceUpdate();
                }} value={this.term}>
                  <option value="">Seleccione una opción</option>
                  {this.state.terms.map((row: any) => {
                    return (
                      <option key={row._id} value={row._id}>{row.concept}</option>
                    );
                  })}
                </select>
               </div>
               <div className="mdl-cell--2-col mdl-cell--middle">
                 <button id="add-keyword" className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onClick={(e) => {
                    if (this.term != ""){
                      this.fields.term.value.push(this.term);
                      this.fields.term.labels.push(this.label);
                      this.term = "";
                      this.label = "";
                      this.forceUpdate();
                    }
                 }}>
                   <i className="material-icons">add</i>
                 </button>
                 <div className="mdl-tooltip" data-mdl-for="add-keyword">
                   Añadir una palabra clave
              </div>
               </div>
               <div className="mdl-cell--10-col mdl-cell--middle">
                 {this.fields.term.value.map((row: any, index: number) => {
                   return (
                     <span className="mdl-chip" key={index}>
                       <span className="mdl-chip__text">{this.fields.term.labels[index]}</span>
                       <button type="button" className="mdl-chip__action" onClick={this.deleteItem.bind(this, index)}><i className="material-icons">cancel</i></button>
                     </span>
                   );
                 })}
               </div>
          </div>
          </main>
       </div>
     );
   }
 }
