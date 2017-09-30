import * as React from 'react'
import {ajax} from 'jquery'
import {LineChart} from "../linechart"

 export class DashBoard extends React.Component <{}, any>{
   public session: User.session;
   public init: boolean = false;
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       activities: null,
       values: null
     }
   }
   componentDidUpdate() {
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/reports/dashboard?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
        window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((data: any) => {
       this.init = true;
       this.setState(data);
       /*let parse = this.parseGraphs(activities);
       this.setState({
         activities: activities,
         values: parse
       });*/
     });
   }
   parseGraphs(activities: Array<CRUD.activity>){
     let count: any = {
       activities:{
         completed: 0,
         failed: 0,
         pending: 0,
         count: 0,
         progress: 0,
         categories: [],
         domains: [],
         completeds: []
       },
       objetives:{
         completed: 0,
         failed: 0,
         pending: 0,
         count: 0,
         progress: 0,
         categories: [],
         domains: []
       }       
     };
     let objetives: Array < CRUD.objetive > = [];
     activities = activities.filter((row) => {
       var date = new Date(row.dateCreated);
       var days = (Date.now() - date.getTime()) / 8.64e+7;
       return days <= 7;
     });
     count.activities.count = activities.length;
     activities.forEach((row) => {
       for (var i in row.objetives){
         objetives.push(row.objetives[i]);
       }
     });
     let categoryObjetives: compat.Map = {};
     count.objetives.count = objetives.length;
     activities.forEach((row) => {
       if (row.isCompleted) {
         count.activities.completed++;
       } else {
         count.activities.pending++;
       }
       var isAdd = count.activities.categories.filter((str: string) => {
         return row.course.name == str;
       });
       if (isAdd.length == 0) {
         var node = {
           name: row.course.name,
           data: [0, 0, 0, 0, 0, 0]
         };
         count.activities.categories.push(row.course.name);
         count.activities.domains.push(node);
         count.activities.completeds.push(node);
       }
     });
     count.activities.domains = count.activities.domains.map((row: { name: string, data: Array<number> }, index: number) => {
       activities.forEach((objetive) => {
        var date = new Date(objetive.dateCreated);
        var dayWeek = date.getDay();
        if (objetive.course.name == row.name){
          row.data[dayWeek]++;
          if (objetive.isCompleted) {
            count.activities.completeds[index].data[dayWeek]++;
          }
        }
       });
       return row;
     });
     objetives.forEach((row) => {
       var isAdd = count.objetives.categories.filter((str: string) => {
          return row.domain.name == str;
        });
        if(isAdd.length == 0){
          count.objetives.categories.push(row.domain.name);
          count.objetives.domains.push({
            name: row.domain.name,
            y: 0
          });
        }
     });
     count.objetives.domains = count.objetives.domains.map((row: {name: string, y:number}) => {
        var counter = objetives.filter((objetive) => {
          return objetive.domain.name == row.name;
        });
        row.y = counter.length;
        return row;
     });
     if (count.activities.count > 0){
       count.activities.progress = (count.activities.completed / count.activities.count) * 100;
     }
     return count;
   }
   render(){
     if(!this.init){
       return null;
     }
     var Colors = ["#90ed7d", "rgb(80, 67, 67)"];
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
          text: `Progreso de actividades`,
          align: 'center',
          style: {
            fontFamily: "Roboto",
            fontSize: "1.5em",
            fontWeight: "bold",
            color: "#888",
          }
        },
        subtitle: {
          text: `${this.state.activities.progress.toFixed(2)}%`,
          align: 'center',
          verticalAlign: 'middle',
          y: 1,
          style: {
            fontFamily: "Roboto",
            fontSize: "3em",
            fontWeight: "bold",
            color: "#888"
          }
        },
        series: [{
            data: [
                ['Actividades completadas', this.state.activities.completed],
                ['Actividades pendientes', this.state.activities.pending]
            ]
        }],
      };
      var Colors = ["#E19431", "#55BADF", "#90ed7d"];
      var DomainObjetives = {
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
          text: `Cobertura de actividades`,
          align: 'center',
          style: {
            fontFamily: "Roboto",
            fontSize: "1.5em",
            fontWeight: "bold",
            color: "#888",
          }
        },
        subtitle: {
          text: `${this.state.objetives.progress.toFixed(2)}%`,
          align: 'center',
          verticalAlign: 'middle',
          y: 1,
          style: {
            fontFamily: "Roboto",
            fontSize: "3em",
            fontWeight: "bold",
            color: "#888"
          }
        },
        series: [{
          data: this.state.objetives.domains
        }]
      };
      var ObjetivesCompleted = {
        credits: false,
        chart: {
            type: 'column'
        },
        title:{
          text:"Actividades asignadas",
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
        series: this.state.activities.domains
      };
      var ActivitieCompleted = {
        credits: false,
        chart: {
            type: 'column'
        },
        title:{
          text:"Actividades completadas",
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
        series: this.state.activities.completeds
      };
      return(
        <div className="mdl-grid demo-content">
          <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
            <LineChart id="completedvsfailed" config={completeVsPending} className="mdl-cell mdl-cell--8-col mdl-cell--6-col-desktop width-center" autoSize={false} title="El porcentaje de progreso mide el avance semanal de tus alumnos."/>
            <LineChart id="coverageObjetive" config={DomainObjetives} className="mdl-cell mdl-cell--8-col mdl-cell--6-col-desktop width-center" autoSize={false} title="La covertura de actividades mide los objetivos a cumplir."/>
          </div>
          <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
            <LineChart id="WeekActivities" config={ObjetivesCompleted}/>
            <LineChart id="ActivitiesCompleted" config={ActivitieCompleted}/>
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
