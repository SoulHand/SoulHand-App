import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import * as Cards from '../cards/activity'
import {ParentCreate} from './parentcreate'
import {AlumnCreate} from './alumncreate'
import * as Objetive from '../objetive/parentcreate'
import {View} from './view'
import { App } from '../app'

 export class Activity extends React.Component <{}, {}>{
   public session: User.session;
   public init: boolean = false;
   public activities: Array<CRUD.activity>=[];
   state: { activities:  Array<CRUD.activity>} = {
     activities: []
   }
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.activities.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.name)==true || exp.test(row.course.name)==true
        || exp.test(row.description)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	activities : filter
 	    });
   	}
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/teacher?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((activities: Array<CRUD.activity>) => {
       this.activities = activities;
       this.init = true;
       this.setState({
         activities: activities
       })
     });
   }
   delete(teacher: People.teacher){
     this.state.activities = this.activities.filter((row) => {
       if (row._id === teacher._id) {
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
           {this.state.activities.map((row) => {
             return (
               <Cards.Activity key={row._id} activity={row} session={this.session} delete={this.delete.bind(this)} />
             );
           })}
         </div>
        <Link to="/activity/create" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
       </App>
     );
   }
 }

export let Add = ParentCreate;
export let Get = View;
export let setObjetive = Objetive.ParentCreate;
export let setStudent = AlumnCreate;
