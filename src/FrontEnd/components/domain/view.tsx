import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Level} from '../cards/level'
import { ModalFree} from "../app"

@withRouter
 export class View extends React.Component <Props.teacherView, CRUD.domain>{
   public session: User.session;
   public init: boolean = false;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   sendKey(event: any){
     event.preventDefault();
     this.state.words.forEach((row) => {
       if (row == event.target.keyword.value){
        throw new Error("No se admiten duplicados!");
      }
     });
     this.state.words.push(event.target.keyword.value);
     event.target.reset();
     let p1 = ajax({
       method: "PUT",
       url: `${window._BASE}/v1/learning/domain/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data: {
         words: JSON.stringify(this.state.words)
       }
     });
     p1.done((domain: CRUD.domain) => {
        this.hidenKey();
        this.setState(domain);
     });
   }
   delete(id: string){
     var _result = this.state.words.filter((row) => {
        return row != id;
     });
     let p1 = ajax({
       method: "PUT",
       url: `${window._BASE}/v1/learning/domain/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data: {
         words: JSON.stringify(_result)
       }
     });
     p1.done((domain: CRUD.domain) => {
        this.setState(domain);
     });
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/learning/domain/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       },
       error: (data: any) => {
         var state: CRUD.codeError = data.responseJSON;
         var config = {
           message: state.message,
           timeout: window.settings.alert.delay
         };
         var message: any = document.querySelector('.mdl-js-snackbar')
         message.MaterialSnackbar.showSnackbar(config);
       }
     });
     p1.done((domain: CRUD.domain) => {
       this.init = true;
       this.setState(domain);
     });
     componentHandler.upgradeAllRegistered();
   }
   showKey() {
     var modal: any = document.getElementById("keyword-add");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.showModal();
   }
   hidenKey() {
     var modal: any = document.getElementById("keyword-add");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.close();
   }
   render(){
     if(!this.init){
       return (
         <ModalFree/>
       );
     }
     return(
       <ModalFree>
           <div className="mdl-grid demo-content">
              <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
                <div className="mdl-grid mdl-color--white demo-content">
                  <div className="mdl-cell--6-col mdl-cell--middle">
                    <div className="mdl-textfield">
                      <label className="mdl-input__expandable-holder">Nombre del dominio</label>
                      <div className="mdl-textfield__input">
                        {this.state.name}
                      </div>
                    </div>
                  </div>
                  <div className="mdl-cell--6-col mdl-cell--middle">
                    <div className="mdl-textfield">
                      <label className="mdl-input__expandable-holder">Numero de niveles</label>
                      <div className="mdl-textfield__input">
                        {this.state.levels.length} Niveles
                      </div>
                    </div>
                  </div>
                  <div className="mdl-cell--12-col mdl-cell--middle">
                      <label className="mdl-input__expandable-holder">Descripción</label>
                      <div className="mdl-textfield__input">
                        {this.state.description}
                      </div>
                  </div>
                  <div className="mdl-cell--12-col mdl-cell--middle">
                    <div className="mdl-grid">
                      <div className="mdl-cell--2-col mdl-cell--middle">
                        <label className="mdl-input__expandable" id="concept-help">Conceptos claves:</label>
                        <div className="mdl-tooltip" data-mdl-for="concept-help">
                          Los conceptos claves son<br/>
                          categorias que definen a <br/>
                          las palabras.
                        </div>
                      </div>
                      <div className="mdl-cell--10-col mdl-cell--middle">
                        {this.state.words.map((row) => {
                          return (
                            <span className="mdl-chip" key={row._id}>
                              <span className="mdl-chip__text">{row.concept}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
                {this.state.levels.length == 0 && (
                  <span>No posee niveles registrados</span>
                )}
                {
                  this.state.levels.length > 0 &&
                  this.state.levels.map((row) => {
                    return (
                      <Level session={this.session} level={row} key={row._id} domain={this.state.name} />
                    );
                  })
                }
              </div>
           </div>
           <dialog className="mdl-dialog" id="keyword-add" key="keyword-add">
             <form method="PUT" id="keyword" onSubmit={this.sendKey.bind(this)}>
              <div className="mdl-dialog__content mdl-dialog__actions--full-width">
                 <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                   <input className="mdl-textfield__input" type="text" id="keyword" required={true}/>
                   <label className="mdl-textfield__label" htmlFor="name">Palabra clave*</label>
                   <span className="mdl-textfield__error">Es requerido</span>
                 </div>
              </div>
              <div className="mdl-dialog__actions">
                <button type="submit" className="mdl-button open">Añadir</button>
                <button type="button" className="mdl-button close" onClick={this.hidenKey.bind(this)}>Cerrar</button>
              </div>
            </form>
           </dialog>
           <div className="fixed">
             <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
             <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
               data-mdl-for="add-menu">
               <li className="mdl-menu__item" onClick={(e) => {
                  this.props.router.push(`/domains/get/${this.props.routeParams.id}/level/create`);
               }}>
                 <i className="material-icons">explore</i> Añadir un nivel
                  </li>
             </ul>
           </div>
       </ModalFree>
     );
   }
 }

/*
<div className="mdl-grid mdl-color--white">
                 <div className="mdl-cell--2-col mdl-cell--middle">
                   <label className="mdl-input__expandable">Palabras claves</label>
                 </div>
                 <div className="mdl-cell--2-col mdl-cell--middle">
                    <button id="add-keyword" className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onClick={this.showKey.bind(this)}>
                      <i className="material-icons">add</i>
                    </button>
                    <div className="mdl-tooltip" data-mdl-for="add-keyword">
                      Añadir una palabra clave
                    </div>
                 </div>
                 <div className="mdl-cell--10-col mdl-cell--middle">
                    {this.state.words.map((row) => {
                      return (
                        <span className="mdl-chip" key={row}>
                          <span className="mdl-chip__text">{row}</span>
                          <button type="button" className="mdl-chip__action" onClick={this.delete.bind(this, row)}><i className="material-icons">cancel</i></button>
                        </span>
                      );
                    })}
                 </div>
                </div>
              </div>
 */