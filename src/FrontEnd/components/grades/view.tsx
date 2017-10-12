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
            <div className="demo-content">
              <span className="mdl-typography--title">Alumnos activos</span>
              <ul className="demo-list-three mdl-list">
                {
                  this.state.grade.students.map((row) => {
                    return (
                      <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                        <span className="mdl-list__item-primary-content">
                          <i className="material-icons mdl-list__item-avatar">account_circle</i>
                          <span>{row.data.name}</span>
                          <span className="mdl-list__item-text-body">
                            {row.exp} XP
                        </span>
                        </span>
                        <span className="mdl-list__item-secondary-content">
                          <div className="mdl-grip">
                            <div onClick={(e) => {
                              this.props.router.push(`/students/get/${row._id}`);
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
