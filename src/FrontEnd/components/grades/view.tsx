import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/grade'
import { HeaderFree } from '../app/header'
import { App, ModalFree } from '../app'

@withRouter
 export class View extends React.Component <Props.teacherView, {grade: CRUD.grade}>{
   public session: User.session;
   public init: boolean = false;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       grade: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/grades/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
          crossDomain:true,
          beforeSend: () => {
            window.progress.start();
          },
          complete: () => {
            window.progress.done();
          },
 	        success:(data: CRUD.grade)=>{
            this.props.router.replace('/grades');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
      method:"GET",
      url: `${window._BASE}/v1/grades/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
     });
     p1.done((grade: CRUD.grade) => {
       this.init = true;
       this.setState({
         grade: grade
       });
     });
   }
   render(){
     if(!this.init){
       return (
         <ModalFree/>
       );
     }
     return (
        <div className="mdl-layout mdl-layout--fixed-header">
         <HeaderFree title={this.state.grade.name} />
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
          <div className="demo-ribbon mdl-color--teal-400"/>
          <main className="demo-main mdl-layout__content">
            <div className="demo-container mdl-grid">
              <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
               <div className="mdl-cell--6-col mdl-cell--middle">
                 <div className="mdl-textfield">
                   <label className="mdl-input__expandable-holder">Nombre</label>
                   <div className="mdl-textfield__input">
                     {this.state.grade.name}
                   </div>
                 </div>
               </div>
              </div>
            </div>
          </main>
        </div>
       
     );
     /*if(this.state.grade){
       body = ();
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/grades"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           {this.state.grade && (
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
               <i className="material-icons">more_vert</i>
             </button>
           )}
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
             <li className="mdl-menu__item"><Link to={`/grades/edit/${this.props.routeParams.id}`}>Editar</Link></li>
             <li className="mdl-menu__item"><Link to={`/grades/grade/edit/${this.props.routeParams.id}`}>Asignar grado</Link></li>
             <li className="mdl-menu__item" onClick={(e)=>{this.delete()}}>Eliminar</li>
           </ul>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            {body}
          </main>
       </div>
     );*/
   }
 }
