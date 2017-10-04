import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {CompleteObjetive} from './completeobjetive'
import {Objetives} from './objetives'
import {LineChart} from '../../linechart'


@withRouter
 export class View extends React.Component <Props.GenericRouter, {student: People.student, activity: CRUD.activity, graph: any}>{
   public session: User.session;
   public data: any = {};
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
       let student = data.students.filter((row) => {
         if (row._id == this.props.routeParams.student) {
           return true;
         }
         return false;
       })[0];
       this.loadData(data, student);
      });
     componentHandler.upgradeAllRegistered();
   }
   loadData(data: CRUD.activity, student: People.student) {
    let count = {
      completed: 0,
      failed: 0,
      pending: 0,
      count: data.objetives.length,
      progress: 0,
      exp: 0
    };
    data.objetives.forEach((row) => {
      var isExist = false;
      for (var i = 0, n = student.activities.length; i < n; i++) {
        if (student.activities[i].objetive != row._id) {
          continue;
        }
        if (student.activities[i].isAdd == true) {
          count.completed++;
          count.exp += student.activities[i].exp;
        } else {
          count.failed++;
        }
        isExist = true;
      }
      if (!isExist) {
        count.pending++;
      }
    });
    if (count.count > 0) {
      count.progress = ((count.completed * 100) / count.count)
    }
    this.setState({
      student: student,
      activity: data,
      graph: count
    })
  }
  sendObjetive(event: any) {
     event.preventDefault();
     var _element = event.target;
     this.data.description = _element.description.value;
     _element.reset();
     let p1 = ajax({
       method: "PUT",
       url: `${window._BASE}/v1/people/students/${this.state.student._id}/activity/${this.state.activity._id}/objetive/${this.data.id}/complete?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data: this.data
     });
     p1.done((data: People.student) => {
       this.hidenKey();
       this.state.activity.students = this.state.activity.students.map((row) => {
         if(row._id == data._id){
           return data;
         }
         return row;
       });
       this.loadData(this.state.activity, data);
     });
  }
  hidenKey() {
     var modal: any = document.getElementById("keyword-add");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.close();
  }
  showFinaly(id: string, isCompleted: boolean){
      this.data = {
        id: id,
        completed: isCompleted,
        description: null
      };
      var modal: any = document.getElementById("keyword-add");
      if (!modal.showModal) {
        window.dialogPolyfill.registerDialog(modal);
      }
      modal.showModal();
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
            <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col">
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
            <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
              <h3 className="mdl-typography--text-center">Objetivos de aprendizaje esperados</h3>
              <table className="mdl-data-table mdl-js-data-table mdl-data-table resize">
                <thead>
                  <tr>
                 <th className="mdl-data-table__cell--non-numeric td-ms-30">Objetivo</th>
                    <th className="td-ms-30">Dominio</th>
                    <th className="td-ms-10">Nivel</th>
                    <th className="td-ms-10">Estado</th>
                    <th className="td-ms-20"></th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.activity.objetives.map((row) => {
                    var error:any = "null";
                    let obj = this.state.student.activities.filter((row2) => {
                      if(row2.objetive == row._id && row2.activity == this.state.activity._id){
                        return true;
                      }
                      return false;
                    });
                    if(obj.length > 0) {
                      if(obj[0].isAdd == true){
                        error = false;
                      }else{
                        error = true;
                      }
                    }
                    let _objetive: CRUD.ActivityMaked;
                    if (obj.length > 0) {
                      _objetive = obj[0];
                    }
                    return (
                      <tr key={row._id} id={row._id} style={(error === true) ? {color: "#d50000"} : ((error === false) ? {color: "rgb(41, 162, 63)"} : {})}>
                        <td className="mdl-data-table__cell--non-numeric" title={row.name}><span>{row.name}</span></td>
                        <td title={row.domain.name}><span>{row.domain.name}</span></td>
                        <td title={row.level.name}><span>{row.level.level}</span></td>
                        <td>
                          {_objetive && _objetive.isAdd == true && (
                            <div className="mdl-cell--1">
                              <div id={`status${row._id}`} className="icon material-icons">check</div>
                              <div className="mdl-tooltip" data-mdl-for={`status${row._id}`}>
                                Objetivo completado
                            </div>
                            </div>
                          )}
                          {_objetive && _objetive.isAdd == false && (
                            <div className="mdl-cell--1">
                              <div id={`status${row._id}`} className="icon material-icons">cancel</div>
                              <div className="mdl-tooltip" data-mdl-for={`status${row._id}`}>
                                  Fallo el objetivo
                              </div>
                            </div>
                          )}
                          {!_objetive && (
                            <div className="mdl-cell--1">
                              <div id={`status${row._id}`} className="icon material-icons">report_problem</div>
                              <div className="mdl-tooltip" data-mdl-for={`status${row._id}`}>
                                El objetivo esta pendiente
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          {!_objetive && (
                            <div className="mdl-cell--1">
                              <div id={`upTop${row._id}`} className="icon material-icons" onClick={(e) => { this.showFinaly(row._id, true)}} style={{cursor: "pointer"}}>thumb_up</div>
                              <div className="mdl-tooltip" data-mdl-for={`upTop${row._id}`}>
                                Dar por completado
                              </div>
                              <div id={`downTop${row._id}`} className="icon material-icons" onClick={(e) => { this.showFinaly(row._id, false) }} style={{ cursor: "pointer" }}>thumb_down</div>
                              <div className="mdl-tooltip" data-mdl-for={`downTop${row._id}`}>
                                Dar por fallido
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            </div>
            <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
              <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
                <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
                  <h2 className="mdl-card__title-text">Puntos de experiencias acumulado</h2>
                </div>
                <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                   <h1 className="mdl-typography--text-center display-2">{this.state.graph.exp} XP</h1>
              </div>
              </div>
            </div>
          </div>
            <dialog className="mdl-dialog" id="keyword-add" key="keyword-add">
              <form method="PUT" id="keyword" onSubmit={(e) => { this.sendObjetive(e)}}>
                  <div className="mdl-dialog__content mdl-dialog__actions--full-width">
                    <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                      <textarea className="mdl-textfield__input" type="text" name="description" id="description" required={true} />
                      <label className="mdl-textfield__label" htmlFor="description">Observaciones*</label>
                      <span className="mdl-textfield__error">Es requerido</span>
                    </div>
                  </div>
                  <div className="mdl-dialog__actions">
                    <button type="submit" className="mdl-button open">Añadir</button>
                    <button type="button" className="mdl-button close" onClick={this.hidenKey.bind(this)}>Cerrar</button>
                  </div>
              </form>
            </dialog>
          </main>
       </div>
     );
  }
 }

export let Completed = CompleteObjetive;
export let ViewObjetive = Objetives;
