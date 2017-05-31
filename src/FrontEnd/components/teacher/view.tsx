import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Teacher} from '../cards/teacher'

@withRouter
 export class View extends React.Component <Props.teacherView, Obj.teacher>{
   public session: User.session;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       teacher: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window.settings.uri}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: People.teacher)=>{
            this.props.router.replace('/teachers');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window.settings.uri}/v1/people/teachers/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((teacher: People.teacher) => {
       this.setState({
         teacher: teacher
       })
     });
   }
   render(){
     let body = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.teacher){
       body = (
         <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-cell--6-col mdl-cell--middle">
            <div className="mdl-grid">
              <div className="mdl-cell--2-col mdl-cell--middle">
                <i className="material-icons">ic_person</i>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Nombre Y Apellido</label>
                  <div className="mdl-textfield__input">
                    {this.state.teacher.data.name}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mdl-cell--6-col mdl-cell--middle">
            <div className="mdl-grid">
              <div className="mdl-cell--2-col mdl-cell--middle">
                <i className="material-icons">ic_person_pin</i>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Documento de identidad</label>
                  <div className="mdl-textfield__input">
                    {this.state.teacher.data.dni}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mdl-cell--6-col mdl-cell--middle">
            <div className="mdl-grid">
              <div className="mdl-cell--2-col mdl-cell--middle">
                <i className="material-icons">ic_calendar</i>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Fecha de nacimiento</label>
                  <div className="mdl-textfield__input">
                    {this.state.teacher.data.birthdate}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mdl-cell--6-col mdl-cell--middle">
            <div className="mdl-grid">
              <div className="mdl-cell--2-col mdl-cell--middle">
                <i className="material-icons">ic_calendar</i>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Creado en</label>
                  <div className="mdl-textfield__input">
                    {this.state.teacher.data.createDate}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mdl-cell--6-col mdl-cell--middle">
            <div className="mdl-grid">
              <div className="mdl-cell--2-col mdl-cell--middle">
                <i className="material-icons">ic_calendar</i>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Grado</label>
                  <div className="mdl-textfield__input">
                    {(this.state.teacher.grade) ? (
                      this.state.teacher.grade.name
                    ) : (
                      <span>No asignado</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
         </div>
       );
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/teachers"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           {this.state.teacher && (
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
               <i className="material-icons">more_vert</i>
             </button>
           )}
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
             <li className="mdl-menu__item">Editar</li>
             <li className="mdl-menu__item" onClick={(e)=>{this.delete()}}>Eliminar</li>
           </ul>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            {body}
          </main>
       </div>
     );
   }
 }
