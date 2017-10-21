import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Objetive} from '../cards/objetive'

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
       data:null
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
     if(!this.init){
       return null;
     }
     let body: any = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/domains"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
             <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
               <i className="material-icons">search</i>
             </label>
             <div className="mdl-textfield__expandable-holder">
               <input className="mdl-textfield__input" type="text" id="search" onChange={(e:any)=>{this.Filter(e)}}/>
               <label className="mdl-textfield__label" htmlFor="search">Ingrese su consulta...</label>
             </div>
           </div>
         </div>
       </header>
         <main className="mdl-layout__content mdl-color--white-100">
           <div className="mdl-grid demo-content">
             <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
               <div className="mdl-grid mdl-color--white demo-content">
                 <div className="mdl-cell--6-col mdl-cell--middle">
                   <div className="mdl-textfield">
                     <label className="mdl-input__expandable-holder">Nombre del objetivo</label>
                     <div className="mdl-textfield__input">
                       {this.state.level.name}
                     </div>
                   </div>
                 </div>
                 <div className="mdl-cell--6-col mdl-cell--middle">
                   <div className="mdl-textfield">
                     <label className="mdl-input__expandable-holder">Numero de objetivos</label>
                     <div className="mdl-textfield__input">
                       {this.state.objetives.length} objetivos
                      </div>
                   </div>
                 </div>
                 <div className="mdl-cell--6-col mdl-cell--middle">
                   <div className="mdl-textfield">
                     <label className="mdl-input__expandable-holder">Descripción</label>
                     <div className="mdl-textfield__input">
                       {this.state.level.description}
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
                   {this.state.level.words.map((row) => {
                     return (
                       <span className="mdl-chip" key={row._id}>
                         <span className="mdl-chip__text">{row.concept}</span>
                         <button type="button" className="mdl-chip__action" onClick={this.deleteWord.bind(this, row)}><i className="material-icons">cancel</i></button>
                       </span>
                     );
                   })}
                 </div>
               </div>
             </div>
             <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
               {
                 this.state.objetives.map((row) => {
                   return (
                     <Objetive session={this.session} objetive={row} key={row._id} delete={this.delete.bind(this)} domain={this.props.routeParams.domain} level={this.props.routeParams.level} />
                   );
                 })
               }
             </div>
           </div>
           <dialog className="mdl-dialog" id="keyword-add" key="keyword-add">
             <form method="PUT" id="keyword" onSubmit={this.sendKey.bind(this)}>
               <div className="mdl-dialog__content mdl-dialog__actions--full-width">
                 <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                   <input className="mdl-textfield__input" type="text" id="keyword" required={true} />
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
         </main>
       </div>
     );
   }
 }
