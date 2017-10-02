import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Level} from '../cards/level'

@withRouter
 export class View extends React.Component <Props.teacherView, CRUD.domain>{
   public session: User.session;
   public init: boolean = false;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/learning/domain/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((domain: CRUD.domain) => {
       this.init = true;
       this.setState(domain);
     });
   }
   showKey(e: any) {
     e.preventDefault();
     var modal: any = document.getElementById("keyword-add");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.showModal();
   }
   hidenKey(e: any) {
     e.preventDefault();
     var modal: any = document.getElementById("keyword-add");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.close();
   }
   render(){
     if(!this.init){
       return null;
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/domains"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
         </div>
       </header>
         <main className="mdl-layout__content mdl-color--white-100">
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
                  <div className="mdl-cell--6-col mdl-cell--middle">
                    <div className="mdl-textfield">
                      <label className="mdl-input__expandable-holder">Descripción</label>
                      <div className="mdl-textfield__input">
                        {this.state.description}
                      </div>
                    </div>
                  </div>
                </div>
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
                        <span className="mdl-chip">
                          <span className="mdl-chip__text">{row}</span>
                          <button type="button" className="mdl-chip__action"><i className="material-icons">cancel</i></button>
                        </span>
                      );
                    })}
                 </div>
                </div>
              </div>
              <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
                {
                  this.state.levels.map((row) => {
                    return (
                      <Level session={this.session} level={row} key={row._id} domain={this.state.name} />
                    );
                  })
                }
              </div>
           </div>
           <dialog className="mdl-dialog" id="keyword-add" key="keyword-add">
             <div className="mdl-dialog__content mdl-dialog__actions--full-width">

             </div>
             <div className="mdl-dialog__actions">
               <button type="button" className="mdl-button close" onClick={this.hidenKey.bind(this)}>Cerrar</button>
             </div>
           </dialog>
         </main>
       </div>
     );
   }
 }
