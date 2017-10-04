import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {CompleteObjetive} from './completeobjetive'
import {Objetives} from './objetives'
import {LineChart} from '../../linechart'


@withRouter
 export class View extends React.Component <Props.GenericRouter, {student: People.student, activity: CRUD.activity, graph: any}>{
   public session: User.session;
   constructor(props:Props.GenericRouter){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       student: null,
       activity: null,
       graph: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   redirect(id: string){
    this.props.router.replace(`/activity/get/${this.props.routeParams.activity}/student/${this.props.routeParams.student}/complete/${id}`);
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((data: CRUD.activity) => {
       let student: People.student = data.students.filter((row) => {
         if(row._id == this.props.routeParams.student){
           return true;
         }
         return false;
       })[0];
       let count = {
         completed: 0,
         failed: 0,
         pending: 0,
         count: data.objetives.length,
         progress: 0
       };
       data.objetives.forEach((row) => {
         var isExist = false;
         for (var i = 0, n = student.activities.length; i<n; i++){
           if(student.activities[i].objetive != row._id){
              continue;
           }
           if (student.activities[i].isAdd == true){
             count.completed++;
            }else{
              count.failed++;
           }
           isExist = true;
         }
         if(!isExist){
          count.pending++;
         }
       });
       if(count.count > 0){
         count.progress = ((count.completed * 100) / count.count)
       }
       this.setState({
         student: student,
         activity: data,
         graph: count
       })
     });
     componentHandler.upgradeAllRegistered();
   }
   render(){
     if(!this.state.student){
       return (
         <div className="mdl-grid mdl-color--white demo-content">
            <div className="mdl-spinner mdl-js-spinner is-active"></div>
         </div>
       );
     }
     var Colors = ["#00C853", "#424242", "#F44336"];
     var graficConfig = {
        credits: false,
        chart: {
            type: 'pie',
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.y} objetivos</b>'
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
          text: `Progreso de la Actividad`,
          align: 'center',
          style: {
            fontFamily: "Roboto",
            fontSize: "1.5em",
            fontWeight: "bold",
            color: "#888",
          }
        },
        subtitle: {
          text: `${this.state.graph.progress.toFixed(2)}%`,
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
                ['Objetivos completados', this.state.graph.completed],
                ['Objetivos pendientes', this.state.graph.pending],
                ['Objetivos fallidos', this.state.graph.failed]
            ]
        }],
      };     
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to={`/activity/get/${this.props.routeParams.activity}`}><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
              <i className="material-icons">more_vert</i>
           </button>
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
           </ul>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            <div className="mdl-grid mdl-color--white demo-content">
            <div className="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
              <LineChart id="container" config={graficConfig}/>
            </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Nombre de la actividad</label>
                    <div className="mdl-textfield__input">
                      {this.state.activity.name}
                    </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Descripción de la actividad</label>
                    <div className="mdl-textfield__input">
                      {this.state.activity.description}
                    </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Nombre del alumno</label>
                    <div className="mdl-textfield__input">
                      {this.state.student.data.name}
                    </div>
                </div>
              </div>
            </div>
              <label className="label static">Objetivos de aprendizaje esperados</label>
              <table className="mdl-data-table mdl-js-data-table mdl-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric">Objetivo</th>
                    <th>Dominio</th>
                    <th>Nivel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.activity.objetives.map((row) => {
                    var error:any = "null";
                    var content = (
                      <div className="mdl-cell--1">
                        <div id={`toolp${row._id}`} className="icon material-icons" onClick={this.redirect.bind(this, [row._id])}>delete</div>
                        <div className="mdl-tooltip" data-mdl-for={`toolp${row._id}`}>
                          El objetivo esta pendiente
                        </div>
                      </div>
                    );
                    let obj = this.state.student.activities.filter((row2) => {
                      if(row2.objetive == row._id && row2.activity == this.state.activity._id){
                        return true;
                      }
                      return false;
                    });
                    if(obj.length > 0) {
                      if(obj[0].isAdd == true){
                        error = false;
                        content = (
                          <div className="mdl-cell--1">
                            <div id={`toolp${row._id}`} className="icon material-icons">check</div>
                            <div className="mdl-tooltip" data-mdl-for={`toolp${row._id}`}>
                              Objetivo completado
                            </div>
                          </div>
                        );
                      }else{
                        error = true;
                        content = (
                          <div className="mdl-cell--1">
                            <div id={`toolp${row._id}`} className="icon material-icons">cancel</div>
                            <div className="mdl-tooltip" data-mdl-for={`toolp${row._id}`}>
                              Fallo el objetivo
                            </div>
                          </div>
                        );
                      }
                    }
                    return (
                      <tr key={row._id} id={row._id} style={(error === true) ? {color: "#d50000"} : ((error === false) ? {color: "rgb(41, 162, 63)"} : {})}>
                        <td className="mdl-data-table__cell--non-numeric" title={row.name}><span>{row.name}</span></td>
                        <td title={row.domain.name}><span>{row.domain.name}</span></td>
                        <td title={row.level.name}><span>{row.level.name}</span></td>
                        <td>{content}</td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
          </main>
       </div>
     );
   }
 }

export let Completed = CompleteObjetive;
export let ViewObjetive = Objetives;
