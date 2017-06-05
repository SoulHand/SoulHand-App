import * as React from 'react'
import {ajax} from 'jquery'
import {LineChart} from "../linechart"

 export class DashBoard extends React.Component <{}, {activities: Array<CRUD.activity>, objetives: Array<CRUD.objetive>}>{
   public session: User.session;
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       activities: null,
       objetives: null
     }
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/teacher?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     let p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/objetives/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done()]).then((data: any) => {
       let activities:Array<CRUD.activity> = data[0];
       let objetives:Array<CRUD.objetive> = data[1];
       this.setState({
         activities: activities,
         objetives: objetives
       })
     });
   }
   render(){
     if(!this.state.activities){
       return (
         <div className="mdl-grid mdl-color--white demo-content">
            <div className="mdl-spinner mdl-js-spinner is-active"></div>
         </div>
       );
     }
     let count = {
       completed: 0,
       failed: 0,
       pending: 0,
       count: 0
     };
     let categoryObjetives: compat.Map = {};
     this.state.activities.forEach((row) => {
       if(row.isCompleted){
         count.completed++;
       }else{
         count.pending++;
       }
     });
     this.state.objetives.forEach((row) => {
       if(!categoryObjetives[row.domain.name]){
         categoryObjetives[row.domain.name] = 0;
       }
       categoryObjetives[row.domain.name]++;
     });
     var completeVsPending = {
        chart: {
            type: 'pie'
        },
        title:{
          align: "center",
          text: "Actividades",
          style:{
            fontFamily: "Roboto",
            fontSize: "1em",
            fontWeight: "bold",
            color: "#888"
          }
        },
        plotOptions: {
            pie: {
                //borderColor: '#000000',
                innerSize: '60%'
            }
        },
        series: [{
            data: [
                ['Actividades completadas', count.completed],
                ['Actividades pendientes', count.pending]
            ]
        }]
      };
     var DomainObjetives = {
        chart: {
            type: 'pie'
        },
        title:{
          align: "center",
          text: "Objetivos de aprendizaje",
          style:{
            fontFamily: "Roboto",
            fontSize: "1em",
            fontWeight: "bold",
            color: "#888"
          }
        },
        plotOptions: {
            pie: {
                //borderColor: '#000000',
                innerSize: '60%'
            }
        },
        series: [{
            data: Object.entries(categoryObjetives)
        }]
      };
     return(
       <div className="mdl-grid demo-content">
         <div className="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
           <LineChart id="completedvsfailed" config={completeVsPending}/>
           <LineChart id="domainobjetive" config={DomainObjetives}/>
         </div>
         <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
           <div id="graph1"></div>
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
