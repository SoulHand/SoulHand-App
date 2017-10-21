import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import * as Cards from '../cards/teacher'
import {Header} from '../app/header'
import { App, ModalSearch } from '../app'
import {View} from './view'
import {Edit} from './edit'
import {SetGrade} from './setgrade'
import {ParentCreate} from './parentcreate'

 export class Teacher extends React.Component <{}, {}>{
   public session: User.session;
   public teachers: Array<People.teacher>=[];
   public init: boolean = false;
   state: { teachers:  Array<People.teacher>} = {
     teachers: []
   }
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.teachers.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
          return exp.test(row.data.name) == true || exp.test(row.data.dni) == true || (row.grade && exp.test(row.grade.name) == true);
   		});
   		this.setState({
 	      	teachers : filter
 	    });
   	}
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((teachers: Array<People.teacher>) => {
       this.teachers = teachers;
       this.init = true;
       this.setState({
         teachers: teachers
       })
     });
   }
   delete(teacher: People.teacher){
     this.teachers = this.teachers.filter((row) => {
       if (row._id === teacher._id) {
         return false;
       }
       return true;
     })
     this.setState({
       teachers: this.teachers
     });
   }
   render(){
     if (!this.init) {
       return (
         <App />
       );
     }
     return (
       <ModalSearch filter={this.Filter.bind(this)} title="Docentes">
         <div className="mdl-grid">
           {this.state.teachers.map((row) => {
             return (
               <Cards.Teacher key={row._id} teacher={row} session={this.session} delete={this.delete.bind(this)} />
             );
           })}
          </div>
          <Link to="/teachers/create" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
       </ModalSearch>
     );
   }
 }


export let Add = ParentCreate;
export let Get = View;
export let Modify = Edit;
export let Grade = SetGrade;
