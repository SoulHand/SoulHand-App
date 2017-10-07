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
            </div>
            <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--8-col mdl-grid">
              <h3 className="mdl-typografy mdl-text-center">Morfemas asociados</h3>
              <table className="mdl-data-table mdl-js-data-table mdl-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric td-ms-20">Palabra</th>
                    <th className="td-ms-20">Expresión regular</th>
                    <th className="td-ms-20">Tipo</th>
                    <th className="td-ms-20">Modo</th>
                    <th className="td-ms-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.morphems.map((row) => {
                      var type, mode;
                      switch(row.type){
                        case window.WORDS.TYPE_MORPHEMS.DERIVATE:
                          type = "DERIVATIVOS";
                        break;
                        case window.WORDS.TYPE_MORPHEMS.FLEX:
                          type = "FLEXIVOS";
                        break;
                        case window.WORDS.TYPE_MORPHEMS.NOFOREING:
                          type = "INDEPENDIENTES";
                        break;
                      }
                      switch(row.mode){
                        case window.WORDS.MODE_MORPHEMS.PREFIX:
                          mode = "PREFIJOS";
                        break;
                        case window.WORDS.MODE_MORPHEMS.INTERFIX:
                          mode = "INTERFIJOS";
                        break;
                        case window.WORDS.MODE_MORPHEMS.SUFIX:
                          mode = "SUFIJOS";
                        break;
                        case window.WORDS.MODE_MORPHEMS.TIME:
                          mode = "TIEMPO VERBAL";
                        break;
                        case window.WORDS.MODE_MORPHEMS.COUNT:
                          mode = "NUMERO";
                        break;
                        case window.WORDS.MODE_MORPHEMS.GENERO:
                          mode = "GENERO";
                        break;
                      }
                      return (
                        <tr key={row._id} id={row._id}>
                          <td className="mdl-data-table__cell--non-numeric" title={row.key}><span>{row.key}</span></td>
                          <td title={row.regexp}><span>{row.regexp}</span></td>
                          <td title={type}><span>{type}</span></td>
                          <td title={mode}><span>{mode}</span></td>
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

/* <StudentActivity key={row._id} student={row} session={this.session} delete={this.remove.bind(this)} activity={}/>