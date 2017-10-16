import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import * as Cards from '../cards/student'
import {Header} from '../app/header'
import {View} from './view'
import { App } from '../app'
import {Edit} from './edit'
import {SetGrade} from './setgrade'
import {ParentCreate} from './parentcreate'
import * as Physics from './physic'
import * as Activities from './activity'

 export class Student extends React.Component <{}, {}>{
   public session: User.session;
   public init: boolean = false;
   public students: Array<People.student>=[];
   state: { students:  Array<People.student>} = {
     students: []
   }
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.students.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.data.name)==true || exp.test(row.data.dni)==true || (row.grade && exp.test(row.grade.name)==true)){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	students : filter
 	    });
   	}
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/students/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((students: Array<People.student>) => {
       this.students = students;
       this.init = true;
       this.setState({
         students: students
       })
     });
   }
   delete(student: People.student){
     this.state.students = this.students.filter((row) => {
       if (row._id === student._id) {
         return false;
       }
       return true;
     })
     this.setState(this.state);
   }
   render(){
     if (!this.init) {
       return (
         <App />
       );
     }
     return (
       <App>
         <div className="mdl-grid">
           {
              this.state.students.map((row) => {
                return (
                  <Cards.Student key={row._id} student={row} session={this.session} delete={this.delete.bind(this)} />
                );
              })
           }
         </div>
       </App>
     );
   }
 }


export let Add = ParentCreate;
export let Get = View;
export let Modify = Edit;
export let Grade = SetGrade;
export let Physic = Physics;
export let Activity = Activities;
