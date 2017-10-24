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
     });
   }
   render(){
     if(!this.init){
       return null;
     }
     var Colors = ["#90ed7d", "rgb(80, 67, 67)"];
     var completeVsPending: Highcharts.Options = {
        credits: {
          enabled: false
        },
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
      var DomainObjetives: Highcharts.Options = {
        credits: {
          enabled: false
        },
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
      var ObjetivesCompleted: Highcharts.Options = {
        credits: {
          enabled: false
        },
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
          categories:["Lun","Mart","Mier","Jue","Vier"],
          title:{
            text:"días de la semana"
          }
        },
        yAxis:{
          title:{
            text:"Cantidad de actividades asignadas"
          }
        },
        series: this.state.activities.domains
      };
      var ActivitieCompleted: Highcharts.Options = {
        credits: {
          enabled: false
        },
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
          categories:["Lun","Mart","Mier","Jue","Vier"],
          title:{
            text:"días de la semana"
          }
        },
        yAxis:{
          title:{
            text:"Cantidad de actividades completadas"
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
              <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
                <h2 className="mdl-card__title-text mdl-typography--text-center">Total Objetivos completados</h2>
              </div>
              <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                {this.state.objetives.completed}                
              </div>
            </div>
          </div>
        </div>
      );
   }
 }
