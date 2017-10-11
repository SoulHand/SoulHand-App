import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import { ModalFree } from "../../app"

@withRouter
export class View extends React.Component <Props.teacherView, Words.word>{
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
  remove(hiperonimo: string, id: string){
    ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/terms/${hiperonimo}/hiponimos/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      crossDomain: true,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      },
      success: (data) => {
        var terms = this.state.terms.map((row) => {
          row.hiponimos = row.hiponimos.filter((hipo) => {
            return hipo._id != id;
          });
          return row;
        });
        terms = this.state.terms.filter((row) => {
          return row.hiponimos.length > 0;
        });
        this.setState({ terms: terms});
      }
    });
  }
  componentDidMount(){
    let p1 = ajax({
      method:"GET",
      url: `${window._BASE}/v1/words/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done((word: Words.word) => {
      this.init = true;
      this.setState(word)
    });
  }
  render(){
    if (!this.init) {
      return (
        <ModalFree />
      );
    }
    return(
      <ModalFree>
        <div className="mdl-grid demo-content">
          <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
            <h3 className="mdl-typografy mdl-text-center">{this.state.key}</h3>
            <div className="mdl-cell--12-col mdl-cell--middle">
              {this.state.concepts.map((row) => {
                return (
                  <span className="mdl-chip" key={row._id}>
                    <span className="mdl-chip__text" title={row.key}>{row.value}</span>
                  </span>
                );
              })}
            </div>
            <h5>Definiciones</h5>
            <ul className="demo-list-three mdl-list">
              {this.state.terms.map((row) => {
                return (
                  <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                    <span className="mdl-list__item-primary-content">
                      <span title={row.description}>{row.concept}</span>
                      {row.hiponimos.map((word) => {
                        return (
                          <span className="mdl-list__item-text-body" key={word._id}>
                            {word.description}
                          </span>
                        )
                      })}
                    </span>
                    <span className="mdl-list__item-secondary-content">
                      <a className="mdl-list__item-secondary-action" href="javascript:void(0)" onClick={this.remove.bind(this, row._id, row.hiponimos[0]._id)}><i className="material-icons">delete</i></a>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <Link to={`/words/get/${this.props.routeParams.id}/morphemas/create`} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
      </ModalFree>
    );
  }
}

/* <StudentActivity key={row._id} student={row} session={this.session} delete={this.remove.bind(this)} activity={}/>