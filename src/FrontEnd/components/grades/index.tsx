import * as React from 'react'
import {ajax} from 'jquery'
import { Link, withRouter } from 'react-router'
import * as Cards from '../cards/grade'
import {ParentCreate} from './parentcreate'
import {View} from './view'
import {Edit} from './edit'
import { App, ModalSearch } from '../app'


@withRouter
 export class Grade extends React.Component <{router: any}, {}>{
   public session: User.session;
   public grades: Array<CRUD.grade>=[];
   public init: boolean = false;
   public deleteId: string = "";
   state: { grades:  Array<CRUD.grade>} = {
     grades: []
   }
   constructor(props:{router: any}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.grades.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.name)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	grades : filter
 	    });
     }
   show(id: string) {
     var modal: any = document.getElementById("modal-delete");
     this.deleteId = id;
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.showModal();
   }
   hiden() {
     var modal: any = document.getElementById("modal-delete");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     this.deleteId = "";
     modal.close();
   }
   delete() {
     ajax({
       method: "DELETE",
       url: `${window._BASE}/v1/grades/${this.deleteId}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data: null,
       crossDomain: true,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       },
       success: (data: CRUD.grade) => {
         this.state.grades = this.grades.filter((row) => {
           if (row._id === data._id) {
             return false;
           }
           return true;
         })
         this.hiden();
         this.setState(this.state);
       }
     });
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((grades: Array<CRUD.grade>) => {
       this.grades = grades;
       this.init = true;
       this.setState({
         grades: grades
       })
     });
     componentHandler.upgradeAllRegistered();
   }
   render(){

     if (!this.init) {
       return (
         <App title="Palabras" />
       );
     }
     return (
       <ModalSearch filter={this.Filter.bind(this)} title="Grados" >
           <ul className="demo-list-three mdl-list">
             {
               this.state.grades.map((row) => {
                 return (
                   <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                     <span className="mdl-list__item-primary-content">
                       <i className="material-icons mdl-list__item-avatar">hourglass_empty</i>
                       <span>{row.name}</span>
                       <span className="mdl-list__item-text-body">
                         {row._id}
                       </span>
                     </span>
                     <span className="mdl-list__item-secondary-content">
                       <div className="mdl-grip">
                         <div onClick={(e) => {
                           this.props.router.push(`/grades/get/${row._id}`);
                         }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                         <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                           Ver
                        </div>
                         <div onClick={this.show.bind(this, row._id, "word")} id={`delete${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>delete</div>
                         <div className="mdl-tooltip" data-mdl-for={`delete${row._id}`}>
                           Eliminar
                        </div>
                       </div>
                     </span>
                   </li>
                 );
               })
             }
            </ul>
            <Link to="/grades/create" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
            <dialog className="mdl-dialog" id="modal-delete" key="modal-delete">
              <div className="mdl-dialog__content mdl-dialog__actions--full-width">
                ¿Desea eliminar el siguiente registro?
                </div>
              <div className="mdl-dialog__actions">
                <button type="submit" className="mdl-button open" onClick={this.delete.bind(this)}>De acuerdo</button>
                <button type="button" className="mdl-button close" onClick={this.hiden.bind(this)}>No estoy de acuerdo</button>
              </div>
            </dialog>
       </ModalSearch>
     );
   }
 }

 export let Add = ParentCreate;
 export let Get = View;
 export let Modify = Edit;
