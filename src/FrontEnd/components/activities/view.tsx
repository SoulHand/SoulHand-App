import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/activity'
import {ObjetiveActivity} from '../cards/objetiveactivity'
import {StudentActivity} from '../cards/studentactivity'

@withRouter
export class View extends React.Component <Props.teacherView, CRUD.activity>{
  public session: User.session;
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
          this.props.router.replace('/students');
        }
  });
  }
  deleteObjetive(id: string, level: string, domain: string){
    ajax({
        method:"DELETE",
        url: `${window._BASE}/v1/knowedge/${domain}/objetives/${level}/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data:null,
        crossDomain:true,
        success:(data: CRUD.activity)=>{
          this.props.router.replace('/students');
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
      data:null
    });
    p1.done((activity: CRUD.activity) => {
      this.setState(activity)
    });
  }
  render(){
    let body = (
      <div className="mdl-grid mdl-color--white demo-content">
        <div className="mdl-spinner mdl-js-spinner is-active"></div>
      </div>
    );
    if(this.state){
      body = (<List.Activity activity={this.state}/>);
    }
    return(
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
      <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
      <div className="mdl-layout__drawer-button"><Link to="/activity"><i className="material-icons">&#xE5C4;</i></Link></div>
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">SoulHand</span>
          <div className="mdl-layout-spacer"></div>
          {this.state && (
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
              <i className="material-icons">more_vert</i>
            </button>
          )}
          <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
            {this.state && this.state.isCompleted == false && (
              <li className="mdl-menu__item" onClick={this.completed.bind(this)}>Completar Actividad</li>
            )}            
            <li className="mdl-menu__item" onClick={(e)=>{this.delete()}}>Eliminar</li>
          </ul>
        </div>
      </header>
        <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
              {body}
            </div>
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--8-col mdl-grid">
              <h3 className="mdl-typografy mdl-text-center">Objetivos asignados</h3>
              <table className="mdl-data-table mdl-js-data-table mdl-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric td-ms-30">Objetivo</th>
                    <th className="td-ms-20">Dominio</th>
                    <th className="td-ms-10">Nivel</th>
                    <th className="td-ms-10">XP</th>
                    <th className="td-ms-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state && this.state.objetives.map((row) => {
                      // <ObjetiveActivity key={row._id} objetive={row} session={this.session} delete={this.remove.bind(this)} activity={this.state._id} />
                      if (!row.domain || !row.level) {
                        return null;
                      }
                      return (
                        <tr key={row._id} id={row._id}>
                          <td className="mdl-data-table__cell--non-numeric" title={row.name}><span>{row.name}</span></td>
                          <td title={row.domain.name}><span>{row.domain.name}</span></td>
                          <td>
                            <span id={`viewtop1${row._id}`}>{row.level.level}</span>
                            <div className="mdl-tooltip" data-mdl-for={`viewtop1${row._id}`}>
                              {row.level.name}
                            </div>
                          </td>
                          <td>
                            {row.exp}
                          </td>
                          <td>
                            <div onClick={(e) => {
                              this.props.router.replace(`/objetives/get/${row._id}`);
                            }} id={`view1${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                            <div className="mdl-tooltip" data-mdl-for={`view1${row._id}`}>
                              Ver detalles
                            </div>
                            <div id={`row1delete${row._id}`} className="icon material-icons" onClick={this.deleteObjetive.bind(this, [row._id, row.level._id, row.domain._id])} style={{ cursor: "pointer" }}>delete</div>
                            <div className="mdl-tooltip" data-mdl-for={`row1delete${row._id}`}>
                              Eliminar
                            </div>
                          </td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
            <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
              <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
                <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
                  <h2 className="mdl-card__title-text">Total puntos de experiencia</h2>
                </div>
                <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                  <h1 className="mdl-typography--text-center display-2">{(this.state) ? this.state.exp : 0} XP</h1>
                </div>
              </div>
            </div>
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--8-col mdl-grid">
              <h3 className="mdl-typografy mdl-text-center">Alumnos asignados</h3>
              <table className="mdl-data-table mdl-js-data-table mdl-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric">Id</th>
                    <th className="td-ms-30">Nombre y apellido</th>
                    <th className="td-ms-10">XP</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state && this.state.students.map((row) => {
                    return (
                        <tr key={row._id} id={row._id}>
                          <td className="mdl-data-table__cell--non-numeric" title={row._id}><span>{row._id}</span></td>
                          <td title={row.data.name}><span>{row.data.name}</span></td>
                          <td title={"pendiente cargar experiencia"}><span>{0}</span></td>
                          <td>
                            <div className="mdl-cell--1">
                              <div onClick={(e) => {
                                this.props.router.replace(`/activity/get/${this.props.routeParams.id}/student/${row._id}`);
                              }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                              <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                                Ver detalles
                              </div>
                              <div id={`delete${row._id}`} className="icon material-icons" onClick={this.remove.bind(this, [row._id])} style={{cursor: "pointer"}}>delete</div>
                              <div className="mdl-tooltip" data-mdl-for={`delete${row._id}`}>
                                Eliminar
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
          </div>
          <div className="fixed">
            <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
            <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
              data-mdl-for="add-menu">
              <li className="mdl-menu__item" onClick={(e) => {
                this.props.router.replace(`/objetives/create/${this.props.routeParams.id}`);
              }}><i className="material-icons">explore</i> Añadir objetivos</li>
              <li className="mdl-menu__item" onClick={(e) => {
                this.props.router.replace(`/activity/set/${this.props.routeParams.id}/student`);
              }}><i className="material-icons">face</i> Añadir alumnos</li>
            </ul>
          </div>
        </main>
      </div>
    );
  }
}

/* <StudentActivity key={row._id} student={row} session={this.session} delete={this.remove.bind(this)} activity={}/>