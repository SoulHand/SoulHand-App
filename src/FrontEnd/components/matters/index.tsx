import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import * as Cards from '../cards/matter'
import {ParentCreate} from './parentcreate'
import {View} from './view'
import {Edit} from './edit'
import {Menu} from '../app/menu'


 export class Matter extends React.Component <{}, {}>{
   public session: User.session;
   public matters: Array<CRUD.grade>=[];
   state: { matters:  Array<CRUD.grade>} = {
     matters: []
   }
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   Filter(event:any){
   		var filter=this.matters.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.name)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	matters : filter
 	    });
   	}
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((matters: Array<CRUD.grade>) => {
       this.matters = matters;
       this.setState({
         matters: matters
       })
     });
   }
   delete(teacher: People.teacher){
     this.state.matters = this.matters.filter((row) => {
       if (row._id === teacher._id) {
         return false;
       }
       return true;
     })
     this.setState(this.state);
   }
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
         <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
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
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
               <i className="material-icons">more_vert</i>
             </button>
             <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
               <li className="mdl-menu__item">A cerca de</li>
               <li className="mdl-menu__item">Contacto</li>
               <li className="mdl-menu__item">Información legal</li>
             </ul>
           </div>
         </header>
          <Menu/>
          <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid demo-content">
             {this.state.matters.map((row) => {
               return (
               <Cards.Matter key={row._id} matter={row} session={this.session} delete={this.delete.bind(this)}/>
               );
             })}
             <Link to="/matters/create" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
          </div>
          </main>
       </div>
     );
   }
 }

 export let Add = ParentCreate;
 export let Get = View;
 export let Modify = Edit;
