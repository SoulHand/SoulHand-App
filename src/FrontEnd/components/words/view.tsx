import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/activity'
import {ObjetiveActivity} from '../cards/objetiveactivity'
import {StudentActivity} from '../cards/studentactivity'

@withRouter
export class View extends React.Component <Props.teacherView, Words.Lexema>{
  public session: User.session;
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
      data:null
    });
    p1.done((lexema: Words.Lexema) => {
      this.setState(lexema)
    });
  }
  render(){
    if(!this.state){
      return (
        <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
        </div>
      );
    }
    return(
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
      <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
      <div className="mdl-layout__drawer-button"><Link to="/words"><i className="material-icons">&#xE5C4;</i></Link></div>
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">SoulHand</span>
          <div className="mdl-layout-spacer"></div>
        </div>
      </header>
        <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
                <div className="mdl-cell--6-col mdl-cell--middle">
                  <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Lexema</label>
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
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
              <h3 className="mdl-typografy mdl-text-center">Morfemas asociados</h3>
              <table className="mdl-data-table mdl-js-data-table mdl-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric td-ms-5">Palabra</th>
                    <th className="td-ms-5">Expresión regular</th>
                    <th className="td-ms-40">conceptos</th>
                    <th className="td-ms-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.morphems.map((row) => {
                      return (
                        <tr key={row._id} id={row._id}>
                          <td className="mdl-data-table__cell--non-numeric" title={row.key}><span>{row.key}</span></td>
                          <td title={row.regexp}><span>{row.regexp}</span></td>
                          <td>
                            {row.concepts.map((concept, index) => {
                              return (
                                <span className="mdl-chip" key={concept.key + index}>
                                  <span className="mdl-chip__text" title={concept.key}>{concept.value}</span>
                                </span>
                              );
                            })}
                          </td>
                          <td>
                            <div id={`row1delete${row._id}`} className="icon material-icons" onClick={this.remove.bind(this, [row._id])} style={{ cursor: "pointer" }}>delete</div>
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
          </div>
          <Link to={`/words/get/${this.props.routeParams.id}/morphemas/create`} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
        </main>
      </div>
    );
  }
}