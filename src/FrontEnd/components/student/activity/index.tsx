import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {CompleteObjetive} from './completeobjetive'
import {Objetives} from './objetives'
import {LineChart} from '../../linechart'
import { HeaderFree } from "../../app/header"
import { ModalFree } from "../../app"


@withRouter
 export class View extends React.Component <Props.GenericRouter, {student: People.student, activity: CRUD.activity, graph: any}>{
   public session: User.session;
   public init: boolean = false;
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
       data:null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
     });
     p1.done((data: CRUD.activity) => {
       this.init = true;
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
    for (var i = 0, m = student.activities.length; i<m; i++){
      for (var j = 0, n = data.objetives.length; j<n; j++){
        if (student.activities[i].objetive != data.objetives[j]._id
          || student.activities[i].activity != data._id) {
          continue;
        }
        var row = data.objetives[j];
        if (student.activities[i].isAdd == true) {
          count.completed++;
          count.exp += student.activities[i].exp;
        } else {
          count.failed++;
        }
        break;
      }
    }
    count.pending = count.count - (count.completed + count.failed);
    if (count.count > 0) {
      count.progress = ((count.completed * 100) / count.count)
    }
    console.log(count);
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
    if (!this.init) {
      return (
        <ModalFree />
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
    return (
      <div className="mdl-layout mdl-layout--fixed-header">
        <HeaderFree title={this.state.activity.name + " - " + this.state.student.data.name} />
        <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
        <div className="demo-ribbon mdl-color--teal-400" />
        <main className="demo-main mdl-layout__content">
          <div className="demo-container mdl-grid">
            <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--12-col mdl-grid">
              <div className="mdl-cell--5-col mdl-cell--middle">
                <div className="mdl-cell--12-col mdl-cell--middle">
                  <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Nombre de la actividad</label>
                    <div className="mdl-textfield__input">
                      {this.state.activity.name}
                    </div>
                  </div>
                </div>
                <div className="mdl-cell--12-col mdl-cell--middle">
                  <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Descripción de la actividad</label>
                    <div className="mdl-textfield__input">
                      {this.state.activity.description}
                    </div>
                  </div>
                </div>
                <div className="mdl-cell--12-col mdl-cell--middle">
                  <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Nombre del alumno</label>
                    <div className="mdl-textfield__input">
                      {this.state.student.data.name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mdl-cell--7-col mdl-cell--middle">
                <LineChart id="container" config={graficConfig} />
              </div>
            </div>
          </div>
          <div className="mdl-grid">
            <div className="mdl-card mdl-shadow--2dp mdl-cell--8-col">
              <span className="mdl-typography--title">Objetivos de aprendizaje esperados</span>
              <ul className="demo-list-three mdl-list">
                {
                  this.state.activity.objetives.map((row) => {
                    var error: any = "null";
                    let obj = this.state.student.activities.filter((row2) => {
                      if (row2.objetive == row._id && row2.activity == this.state.activity._id) {
                        return true;
                      }
                      return false;
                    });
                    if (obj.length > 0) {
                      if (obj[0].isAdd == true) {
                        error = false;
                      } else {
                        error = true;
                      }
                    }
                    let _objetive: CRUD.ActivityMaked;
                    if (obj.length > 0) {
                      _objetive = obj[0];
                    }
                    return (
                      <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                        <span className="mdl-list__item-primary-content">
                          <i className="material-icons mdl-list__item-avatar">account_circle</i>
                          <span>{row.name}</span>
                          <span className="mdl-list__item-text-body">
                            {row.exp} XP
                          </span>
                        </span>
                        <span className="mdl-list__item-secondary-content" style={(error === true) ? { color: "#d50000" } : ((error === false) ? { color: "rgb(41, 162, 63)" } : {})}>
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
                        </span>
                        <span className="mdl-list__item-secondary-content">
                            {!_objetive && (
                            <div className="mdl-grip">
                              <div id={`upTop${row._id}`} className="icon material-icons" onClick={(e) => { this.showFinaly(row._id, true) }} style={{ cursor: "pointer" }}>thumb_up</div>
                              <div className="mdl-tooltip" data-mdl-for={`upTop${row._id}`}>
                                Dar por completado
                                </div>
                              <div id={`downTop${row._id}`} className="icon material-icons" onClick={(e) => { this.showFinaly(row._id, false) }} style={{ cursor: "pointer" }}>thumb_down</div>
                              <div className="mdl-tooltip" data-mdl-for={`downTop${row._id}`}>
                                Dar por fallido
                                </div>
                            </div>
                          )}
                        </span>
                      </li>
                    );
                  })
                }
              </ul>
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
        </main>
          <dialog className="mdl-dialog" id="keyword-add" key="keyword-add">
            <form method="PUT" id="keyword" onSubmit={(e) => { this.sendObjetive(e) }}>
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
      </div>
    );
  }
 }

export let Completed = CompleteObjetive;
export let ViewObjetive = Objetives;
