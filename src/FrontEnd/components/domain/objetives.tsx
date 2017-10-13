import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Objetive} from '../cards/objetive'
import { HeaderFree } from "../app/header"
import { ModalFree } from "../app"

@withRouter
export class Objetives extends React.Component<Props.objetiveView, { objetives: Array<CRUD.objetive>, level: CRUD.level}>{
   public session: User.session;
   public init: boolean = false;
   public objetives: Array<CRUD.objetive> = [];
   constructor(props:Props.objetiveView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   Filter(event:any){
   		var filter=this.objetives.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.name)==true || exp.test(row.level.name)==true ||
          exp.test(row.description)==true || exp.test(row.domain.name)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
          objetives: filter
      });
   	}
   delete(objetive: CRUD.objetive){
     let obj = this.objetives.filter((row) => {
       if (row._id === objetive._id) {
         return false;
       }
       return true;
     })
     this.setState({
       objetives: obj
     });
   }
   deleteWord(id: string) {
     let p1 = ajax({
       method: "DELETE",
       url: `${window._BASE}/v1/knowedge/${this.props.routeParams.domain}/level/${this.props.routeParams.level}/word/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json"
     });
     p1.done((domain: CRUD.domain) => {
       var level = domain.levels.filter((row) => {
         return row._id == this.props.routeParams.level;
       })[0];
       this.setState({
         level: level
       });
     });
   }
   sendKey(event: any) {
     event.preventDefault();
     var _key = event.target.keyword.value;
     event.target.reset();
     let p1 = ajax({
       method: "PUT",
       url: `${window._BASE}/v1/knowedge/${this.props.routeParams.domain}/level/${this.props.routeParams.level}/word?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data: {
         word: _key
       }
     });
     p1.done((domain: CRUD.domain) => {
      this.hidenKey();
      var level = domain.levels.filter((row) => {
        return row._id == this.props.routeParams.level;
      }) [0];
      this.setState({
        level: level
      });
    });
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/${this.props.routeParams.domain}/level/${this.props.routeParams.level}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
     p1.done().then((level: CRUD.level) => {
       var p2 = ajax({
         method: "GET",
         url: `${window._BASE}/v1/knowedge/${this.props.routeParams.domain}/objetives/${level.name}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
         dataType: "json",
         data: null
        });
        this.setState({
          level: level
        });
        return p2.done()       
     }).then((objetives: Array<CRUD.objetive>) => {
        this.objetives = objetives;
        this.init = true;
        this.setState({
          objetives: this.objetives
        });
     });
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
     if (!this.init) {
       return (
         <ModalFree />
       );
     }
     return (
       <div className="mdl-layout mdl-layout--fixed-header">
         <HeaderFree title={"Nivel de aprendizaje " + this.state.level.name} />
         <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
         <div className="demo-ribbon mdl-color--teal-400" />
         <main className="demo-main mdl-layout__content">
           <div className="demo-container mdl-grid">
             <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
               <div className="mdl-cell--6-col mdl-cell--middle">
                 <div className="mdl-textfield">
                   <label className="mdl-input__expandable-holder">Nombre</label>
                   <div className="mdl-textfield__input">
                     {this.state.level.name}
                   </div>
                 </div>
               </div>
               <div className="mdl-cell--12-col mdl-cell--middle">
                 <label className="mdl-input__expandable-holder">Descripción</label>
                 <div className="mdl-textfield__input">
                   {this.state.level.description}
                 </div>
               </div>
             </div>
           </div>
           <div className="demo-content">
             <span className="mdl-typography--title">Categorías gramaticales</span>
             <ul className="demo-list-three mdl-list">
               {
                 this.state.level.words.map((row) => {
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
           <span className="mdl-typography--title">Niveles de aprendizaje</span>
           <div className="mdl-grid">
             {
               this.state.objetives.map((row) => {
                 return (
                   <Objetive session={this.session} objetive={row} key={row._id} delete={this.delete.bind(this)} domain={this.props.routeParams.domain} level={this.props.routeParams.level} />
                 );
               })
             }
           </div>
         </main>
       </div>
     );
   }
 }
