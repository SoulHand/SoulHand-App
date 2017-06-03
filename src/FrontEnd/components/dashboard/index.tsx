import * as React from 'react'
import {ajax} from 'jquery'

 export class DashBoard extends React.Component <{}, {}>{
   public session: User.session;
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window.settings.uri}/v1/people/teachers/${this.session.user.people.dni}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done().then((teacher:People.teacher) => {
         if(!teacher.grade){
           return false;
         }
         let p2 = ajax({
           method:"GET",
           url: `${window.settings.uri}/v1/activities/${teacher.grade.name}/${teacher._id}/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
           dataType: "json",
           data:null
         });
         return p2.done();
     }).then((activities:Array<CRUD.activity>) => {
       console.log(activities);
     });
   }
   render(){
     return(
       <div className="mdl-grid demo-content">
         <div className="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
           <div id="graph3"></div>
         </div>
         <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
           <div id="graph1"></div>
           <div id="graph2"></div>
         </div>
         <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
           <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
             <div className="mdl-card__title mdl-card--expand mdl-color--teal-300 dog">
               <h2 className="mdl-card__title-text">Aqui van actualizaciones</h2>
             </div>
             <div className="mdl-card__supporting-text mdl-color-text--grey-600">
               Non dolore elit adipisicing ea reprehenderit consectetur culpa.
             </div>
             <div className="mdl-card__actions mdl-card--border">
               <a href="#" className="mdl-button mdl-js-button mdl-js-ripple-effect">Read More</a>
             </div>
           </div>
         </div>
       </div>
     );
   }
 }
