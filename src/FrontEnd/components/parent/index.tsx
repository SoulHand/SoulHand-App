import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import * as Cards from '../cards/parent'
import {ParentCreate} from './parentcreate'
import {View} from './view'
import {Edit} from './edit'
import { App, ModalSearch } from '../app'


 export class Parent extends React.Component <{}, {}>{
   public session: User.session;
   public parents: Array<People.parent>=[];
   public init: boolean = false;
   state: { parents:  Array<People.parent>} = {
     parents: []
   }
   constructor(props:{}){
     super(props)
     window.ReactPath = "/parents";
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.parents.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.data.name)==true || exp.test(row.data.dni)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	parents : filter
 	    });
   	}
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/parents/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((parents: Array<People.teacher>) => {
       this.parents = parents;
       this.init = true;
       this.setState({
         parents: parents
       })
     });
   }
   delete(teacher: People.teacher){
     this.state.parents = this.parents.filter((row) => {
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
        <ModalSearch filter={this.Filter.bind(this)} title="Representantes">
         <div className="mdl-grid">
            {this.state.parents.map((row) => {
              return (
                <Cards.Parent key={row._id} parent={row} session={this.session} delete={this.delete.bind(this)} />
              );
            })}
          </div>
          <Link to="/parents/create" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
        </ModalSearch>
     );
   }
 }

 export let Add = ParentCreate;
 export let Get = View;
 export let Modify = Edit;
