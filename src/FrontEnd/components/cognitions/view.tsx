import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Level} from '../cards/level'
import { HeaderFree } from "../app/header"
import { ModalFree } from "../app"


@withRouter
 export class View extends React.Component <Props.teacherView, CRUD.cognition>{
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
       url: `${window._BASE}/v1/knowedge/cognitions/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
   delete(data: CRUD.domain){
     this.setState(data);
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/cognitions/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
     p1.done((cognition: CRUD.cognition) => {
       this.init = true;
       this.setState(cognition);
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
       <div className="mdl-layout mdl-layout--fixed-header">
         <HeaderFree title={"Función cognitiva " + this.state.name} />
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
          <div className="demo-ribbon mdl-color--teal-400"/>
          <main className="demo-main mdl-layout__content">
            <div className="demo-container mdl-grid">
              <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
               <div className="mdl-cell--6-col mdl-cell--middle">
                 <div className="mdl-textfield">
                   <label className="mdl-input__expandable-holder">Nombre de la función cognitiva</label>
                   <div className="mdl-textfield__input">
                     {this.state.name}
                   </div>
                 </div>
               </div>
               <div className="mdl-cell--12-col mdl-cell--middle">
                 <label className="mdl-input__expandable-holder">Descripción</label>
                 <div className="mdl-textfield__input">
                   {this.state.description}
                 </div>
               </div>
              </div>
            </div>
            <div className="demo-content">
              <span className="mdl-typography--title">Categorías gramaticales</span>
              <ul className="demo-list-three mdl-list">
                {
                  this.state.words.map((row) => {
                    return (
                      <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                        <span className="mdl-list__item-primary-content">
                          <i className="material-icons mdl-list__item-avatar">account_circle</i>
                          <span>{row.concept}</span>
                          <span className="mdl-list__item-text-body">
                            {row.description}
                        </span>
                        </span>
                        <span className="mdl-list__item-secondary-content">
                          <div className="mdl-grip">
                            <div onClick={(e) => {
                              this.props.router.push(`/terms/get/${row._id}`);
                            }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                            <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                              Ver
                            </div>
                          </div>
                        </span>
                      </li>
                    );
                  })
                }
              </ul>
            </div>
            
          </main>
        </div>
     );
   }
 }