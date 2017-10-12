import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/activity'
import {ObjetiveActivity} from '../cards/objetiveactivity'
import {StudentActivity} from '../cards/studentactivity'
import { HeaderFree } from '../app/header'
import { App, ModalFree } from '../app'

@withRouter
export class View extends React.Component <Props.teacherView, Words.Lexema>{
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
  remove(id: string){
    ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/words/lexemas/${this.props.routeParams.id}/morphemas/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      crossDomain: true,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      },
      success: (data: Words.Lexema) => {
        this.setState(data);
      }
    });
  }
  componentDidMount(){
    let p1 = ajax({
      method:"GET",
      url: `${window._BASE}/v1/words/lexemas/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done((lexema: Words.Lexema) => {
      this.init = true;
      this.setState(lexema)
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
        <HeaderFree title={"Lexema " + this.state.key} />
        <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
        <div className="demo-ribbon mdl-color--teal-400" />
        <main className="demo-main mdl-layout__content">
          <div className="demo-container mdl-grid">
            <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Palabra</label>
                  <div className="mdl-textfield__input">
                    {this.state.key}
                  </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Expresión regular</label>
                  <div className="mdl-textfield__input">
                    {this.state.regexp}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="demo-content">
            <span className="mdl-typography--title">Morfemas</span>
            <ul className="demo-list-three mdl-list">
              {
                this.state.morphems.map((row) => {
                  return (
                    <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                      <span className="mdl-list__item-primary-content">
                        <i className="material-icons mdl-list__item-avatar">chat</i>
                        <span>{row.key}</span>
                        <span className="mdl-list__item-text-body">
                          {row.concepts.map((concept, index) => {
                            return (
                              <span className="mdl-chip" key={concept.key + index}>
                                <span className="mdl-chip__text" title={concept.key}>{concept.value}</span>
                              </span>
                            );
                          })}
                        </span>
                      </span>
                      <span className="mdl-list__item-secondary-content">
                        <div className="mdl-grip">
                          <div id={`row1delete${row._id}`} className="icon material-icons" onClick={this.remove.bind(this, [row._id])} style={{ cursor: "pointer" }}>delete</div>
                          <div className="mdl-tooltip" data-mdl-for={`row1delete${row._id}`}>
                            Eliminar
                          </div>
                        </div>
                      </span>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <Link to={`/words/get/${this.props.routeParams.id}/morphemas/create`} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
        </main>
      </div>
    );
  }
}