import * as React from 'react'
import {ajax} from 'jquery'
import {LineChart} from "../linechart"

 export class DashBoard extends React.Component <{}, {activities: Array<CRUD.activity>, objetives: Array<CRUD.objetive>, values: any}>{
   public session: User.session;
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       activities: null,
       objetives: null,
       values: null
     }
   }
   componentDidUpdate() {
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     window.progress.start();
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
       let parse = this.parseGraphs(activities, objetives);
       this.setState({
         activities: activities,
         objetives: objetives,
         values: parse
       });
       window.progress.done();
     });
   }
   parseGraphs(activities: Array<CRUD.activity>, objetives: Array<CRUD.objetive>){
     let count: any = {
       completed: 0,
       failed: 0,
       pending: 0,
       count: activities.length,
       progress: 0,
       categories: [],
       domains:[]
     };
     let categoryObjetives: compat.Map = {};
     activities.forEach((row) => {
       if (row.isCompleted) {
         count.completed++;
       } else {
         count.pending++;
       }
     });
     objetives.forEach((row) => {
        var isAdd = count.categories.filter((str: string) => {
          return row.domain.name == str;
        });
        if(isAdd.length == 0){
          count.categories.push(row.domain.name);
          count.domains.push({
            name: row.domain.name,
            y: 0
          });
        }
     });
     count.domains = count.domains.map((row: {name: string, y:number}) => {
        var counter = objetives.filter((objetive) => {
          return objetive.domain.name == row.name;
        });
        row.y = counter.length;
        return row;
     });
     if(count.count > 0){
       count.progress = (count.completed / count.count) * 100;
     }
     console.log(count);
     return count;
   }
   render(){
     if(!this.state.activities){
       return null;
     }
     var Colors = ["rgb(24, 146, 77)", "#F7C65F"];
      var completeVsPending = {
        credits: false,
        chart: {
            type: 'pie',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y} Actividades</b>'
        },
        plotOptions: {
          pie: {
            innerSize: '60%',
            center: ['50%', '50%'],
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },
        colors: Colors,
        title: {
          text: this.state.values.progress.toFixed(2) + "%",
          align: 'center',
          verticalAlign: 'middle',
          y: 5,
          style: {
            fontFamily: "Roboto",
            fontSize: "3em",
            fontWeight: "bold",
            color: "#888"
          }
        },
        series: [{
            data: [
                ['Actividades completadas', this.state.values.completed],
                ['Actividades pendientes', this.state.values.pending]
            ]
        }],
        width: 200,
        height: 200
      };
      var Colors = ["#649AE1", "#55BADF", "#F7C65F", "#A992E2", "#EC6F5A", "#48C9A9", "#85D27A"];
     var DomainObjetives = {
       credits: false,
       chart: {
         type: 'pie',
         plotShadow: false
       },
       tooltip: {
         pointFormat: '{series.name}: <b>{point.y} actividades</b>'
       },
       plotOptions: {
         pie: {
           innerSize: '60%',
           center: ['50%', '50%'],
           cursor: 'pointer',
           dataLabels: {
             enabled: false
           },
           showInLegend: true
         }
       },
       colors: Colors,
       series: [{
         data: this.state.values.domains
       }]
      };
      var series: Array <any> = [];
      this.state.activities.forEach((activity) => {
        let add = null;
        for(var i in series){
          if(series[i].name === activity.course.name){
            add = series[i];
            break;
          }
        }
        if(!add){
          series.push({
            name: activity.course.name,
            data: [0, 0, 0, 0, 0, 0, 0]
          });
          add = series[series.length-1]
        }
        if(activity.isCompleted == true){
          var date = new Date(activity.dateCompleted);
          var days = (Date.now()-date.getTime())/8.64e+7;
          if(days <= 7){
            var dayWeek = date.getDay();
            if(!add.data[dayWeek]){
              add.data[dayWeek] = 0;
            }
            add.data[dayWeek]++;
          }
        }
      })
     var ObjetivesCompleted = {
        chart: {
            type: 'column'
        },
        title:{
          text:"Aceptación de objetivos",
          x:-20,
          style: {
            fontFamily: "Roboto",
            fontWeight: "bold",
            color: "#888"
          }
        },
        xAxis:{
          categories:["dom", "Lun","Mart","Mier","Jue","Vier", "sab"],
          title:{
            text:"días de la semana"
          }
        },
        series: series
      };
     return(
       <div className="mdl-grid demo-content">
         <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
           <LineChart id="completedvsfailed" config={completeVsPending} className="mdl-cell mdl-cell--8-col mdl-cell--6-col-desktop width-center" autoSize={false}/>
           <LineChart id="domainobjetive" config={DomainObjetives} className="mdl-cell mdl-cell--8-col mdl-cell--6-col-desktop width-center" autoSize={false}/>
         </div>
         <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
          <LineChart id="objetivecompleted" config={ObjetivesCompleted}/>
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
