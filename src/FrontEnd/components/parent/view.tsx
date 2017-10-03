import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Student} from '../cards/student'
import * as List from '../profiles/parent'

@withRouter
 export class View extends React.Component <Props.teacherView, {parent: People.parent}>{
   public session: User.session;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       parent: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   deleteStudent(student: People.student) {
     this.state.parent.students = this.state.parent.students.filter((row) => {
       if (row._id === student._id) {
         return false;
       }
       return true;
     })
     this.setState(this.state);
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: People.parent)=>{
            this.props.router.replace('/parents');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/parents/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((parent: People.teacher) => {
       this.setState({
         parent: parent
       })
     });
   }
   render(){
     let body = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.parent){
       body = (<List.Parent parent={this.state.parent}/>);
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/parents"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           {this.state.parent && (
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
               <i className="material-icons">more_vert</i>
             </button>
           )}
           {this.state.parent && (
             <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
                 <li className="mdl-menu__item" onClick={(e) => {
                   this.props.router.replace(`/parents/edit/${this.props.routeParams.id}`);
                 }}>Editar</li>
                 <li className="mdl-menu__item" onClick={(e) => {
                   this.props.router.replace(`/students/create/${this.state.parent._id}`);
                 }}>Asignar alumno</li>
               <li className="mdl-menu__item" onClick={(e)=>{this.delete()}}>Eliminar</li>
             </ul>
           )}
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            {body}
            {this.state.parent && (
             <div className="mdl-grid demo-content">
               {this.state.parent.students.map((row) => {
                 return (
                   <Student key={row._id} student={row} session={this.session} delete={this.deleteStudent.bind(this)} />
                 );
               })}
             </div>
            )}
          </main>
       </div>
     );
   }
 }
