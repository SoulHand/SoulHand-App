import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/activity'
import {ObjetiveActivity} from '../cards/objetiveactivity'

@withRouter
 export class View extends React.Component <Props.teacherView, {activity: CRUD.activity}>{
   public session: User.session;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       activity: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/activities/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: CRUD.activity)=>{
            this.props.router.replace('/students');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((activity: CRUD.activity) => {
       this.setState({
         activity: activity
       })
     });
   }
   render(){
     let body = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.activity){
       body = (<List.Activity activity={this.state.activity}/>);
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/activity"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           {this.state.activity && (
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
               <i className="material-icons">more_vert</i>
             </button>
           )}
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
             <li className="mdl-menu__item"><Link to={`/students/edit/${this.props.routeParams.id}`}>Editar</Link></li>
             <li className="mdl-menu__item" onClick={(e)=>{this.delete()}}>Eliminar</li>
           </ul>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            {body}
            <div className="mdl-grid mdl-color--white demo-content">
              {this.state.activity && this.state.activity.objetives.map((row) => {
                return (
                  <ObjetiveActivity key={row._id} objetive={row} session={this.session} delete={this.delete.bind(this)} activity={this.state.activity._id}/>
                );
              })}
            </div>
          </main>
       </div>
     );
   }
 }
