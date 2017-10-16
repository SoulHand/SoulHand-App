import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/activity'
import {ObjetiveActivity} from '../cards/objetiveactivity'
import {StudentActivity} from '../cards/studentactivity'
import { App, ModalFree } from '../app'
import { HeaderFree } from '../app/header'

@withRouter
export class View extends React.Component <Props.teacherView, CRUD.activity>{
  public session: User.session;
  public init: boolean = false;
  constructor(props:Props.teacherView){
    super(props)
    let str = localStorage.getItem("session");
    this.session = JSON.parse(str);
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
          this.props.router.replace('/activity');
        }
  });
  }
  deleteObjetive(id: any){
    if(typeof(id) == "object"){
      id= id[0];
    }
    ajax({
        method:"DELETE",
        url: `${window._BASE}/v1/activities/${this.state._id}/objetives/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data:null,
        crossDomain:true,
        success:(data: CRUD.activity)=>{
          this.state.objetives = this.state.objetives.filter((row) => {
            return row._id != id;
          });
          this.state.exp = data.exp;
          this.setState(this.state);
        }
    });
  }
  completed(){
    ajax({
    method:"PUT",
        url: `${window._BASE}/v1/activities/${this.props.routeParams.id}/completed?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data: null,
        crossDomain:true,
        success:(data: CRUD.activity)=>{
          this.setState(data);
        }
  });
  }
  remove(id: string){
    ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/activities/${this.state._id}/student/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      crossDomain: true,
      success: (data: People.student) => {
        this.state.students = this.state.students.filter((row) => {
          return row._id != id;
        });
        this.setState(this.state);
      }
    });
  }
  componentDidMount(){
    let p1 = ajax({
      method:"GET",
      url: `${window._BASE}/v1/activities/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done((activity: CRUD.activity) => {
      this.init = true;
      this.setState(activity)
    });
  }
  render(){
    if (!this.init) {
      return (
        <ModalFree />
      );
    }
    return (
      <div className="mdl-layout mdl-layout--fixed-header">
        <HeaderFree title={this.state.name} menu={
          [
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn" key="BUTTON1">
              <i className="material-icons">more_vert</i>
            </button>
            ,
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple effect mdl-menu--bottom-right" htmlFor="hdrbtn" key="hdrbtn12">
              {this.state && this.state.isCompleted == false && (
                <li className="mdl-menu__item" onClick={this.completed.bind(this)}>Completar Actividad</li>
              )}
              <li className="mdl-menu__item" onClick={(e) => { this.delete() }}>Eliminar</li>
            </ul>
          ]
        }/>
        <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
        <div className="demo-ribbon mdl-color--teal-400" />
        <main className="demo-main mdl-layout__content">
          <div className="demo-container mdl-grid">
            <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
              <List.Activity activity={this.state} />
            </div>
          </div>
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--8-col">
              <span className="mdl-typography--display-1">Objetivos a completar</span>
              <ul className="demo-list-three mdl-list">
                {
                  this.state.objetives.map((row) => {
                  return (
                    <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                      <span className="mdl-list__item-primary-content">
                        <i className="material-icons mdl-list__item-avatar">account_circle</i>
                        <span>{row.name}</span>
                        <span className="mdl-list__item-text-body">
                          {row.exp} XP
                        </span>
                      </span>
                      <span className="mdl-list__item-secondary-content">
                        <div className="mdl-grip">
                          <div onClick={(e) => {
                            this.props.router.push(`/objetives/get/${row._id}`);
                          }} id={`view1${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                          <div className="mdl-tooltip" data-mdl-for={`view1${row._id}`}>
                            Ver detalles
                              </div>
                          <div id={`row1delete${row._id}`} className="icon material-icons" onClick={this.deleteObjetive.bind(this, [row._id])} style={{ cursor: "pointer" }}>delete</div>
                          <div className="mdl-tooltip" data-mdl-for={`row1delete${row._id}`}>
                            Eliminar
                          </div>
                        </div>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
              <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
                <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
                  <h2 className="mdl-card__title-text">Total puntos de experiencia</h2>
                </div>
                <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                  <h1 className="mdl-typography--text-center display-2">{(this.state.exp) ? this.state.exp : 0} XP</h1>
                </div>
              </div>
            </div>
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--8-col">
              <span className="mdl-typography--display-1">Objetivos a completar</span>
              <ul className="demo-list-three mdl-list">
                {
                  this.state.students.map((row) => {
                    // <ObjetiveActivity key={row._id} objetive={row} session={this.session} delete={this.remove.bind(this)} activity={this.state._id} />
                    return (
                      <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                        <span className="mdl-list__item-primary-content">
                          <i className="material-icons mdl-list__item-avatar">account_circle</i>
                          <span>{row.data.name}</span>
                          <span className="mdl-list__item-text-body">
                            {row.exp} XP
                          </span>
                        </span>
                        <span className="mdl-list__item-secondary-content">
                          <div className="mdl-grip">
                            <div onClick={(e) => {
                              this.props.router.push(`/activity/get/${this.props.routeParams.id}/student/${row._id}`);
                            }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                            <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                              Ver detalles
                              </div>
                            <div id={`delete${row._id}`} className="icon material-icons" onClick={this.remove.bind(this, row._id)} style={{ cursor: "pointer" }}>delete</div>
                            <div className="mdl-tooltip" data-mdl-for={`delete${row._id}`}>
                              Eliminar
                            </div>
                          </div>
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          </div>
          <div className="fixed">
            <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
            <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
              data-mdl-for="add-menu">
              <li className="mdl-menu__item" onClick={(e) => {
                this.props.router.push(`/objetives/create/${this.props.routeParams.id}`);
              }}><i className="material-icons">explore</i> Añadir objetivos</li>
              <li className="mdl-menu__item" onClick={(e) => {
                this.props.router.push(`/activity/set/${this.props.routeParams.id}/student`);
              }}><i className="material-icons">face</i> Añadir alumnos</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }
}

/* <StudentActivity key={row._id} student={row} session={this.session} delete={this.remove.bind(this)} activity={}/>