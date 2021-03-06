import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as Word from './word'
import * as Term from './terms'
import {Header} from '../app/header'
import {ParentCreate} from './parentcreate'
import {AlumnCreate} from './alumncreate'
import * as Objetive from '../objetive/parentcreate'
import {View} from './view'
import {Menu} from '../app/menu'


@withRouter
export class Lexemas extends React.Component<Props.teacherView, {}>{
  public session: User.session;
  state: { lexemas: Array<Words.Lexema>} = {
    lexemas: []
  }
  constructor(props:any){
    super(props)
    let str = localStorage.getItem("session");
    this.session = JSON.parse(str);
  }
  componentDidUpdate(){
    componentHandler.upgradeAllRegistered();
  }
  componentDidMount(){
    let p1 = ajax({
      method:"GET",
      url: `${window._BASE}/v1/words/lexemas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:null
    });
    p1.done((lexemas: Array<Words.Lexema>) => {
      this.setState({
        lexemas: lexemas
      });
    });
  }
  delete(id: string){
    let p1 = ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/words/lexemas/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null
    });
    p1.done(() => {
      this.state.lexemas = this.state.lexemas.filter((row) => {
        if (row._id === id) {
          return false;
        }
        return true;
      });
      this.setState(this.state);
    });
  }
  render(){
    return(
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
        <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">SoulHand</span>
            <div className="mdl-layout-spacer"></div>
            <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
              <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
                <i className="material-icons">search</i>
              </label>
            </div>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
              <li className="mdl-menu__item">A cerca de</li>
              <li className="mdl-menu__item">Contacto</li>
              <li className="mdl-menu__item">Información legal</li>
            </ul>
          </div>
        </header>
        <Menu/>
        <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid demo-content">
            <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
              <h3>Lexemas Registrados</h3>
              <table className="mdl-data-table mdl-js-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric">Lexema</th>
                    <th>Expresión regular</th>
                    <th>morfemas</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.lexemas.map((row) => {
                      return (
                        <tr key={row._id}>
                          <td className="mdl-data-table__cell--non-numeric"><span>{row.key}</span></td>
                          <td className="mdl-data-table__cell">{row.regexp}</td>
                          <td className="mdl-data-table__cell">{row.morphems.length}</td>
                          <td className="mdl-data-table__cell">
                            <div onClick={(e) => {
                              this.props.router.push(`words/get/${row._id}`);
                            }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                            <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                              Ver
                            </div>
                            <div onClick={this.delete.bind(this, row._id)} id={`delete${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>delete</div>
                            <div className="mdl-tooltip" data-mdl-for={`delete${row._id}`}>
                              Eliminar
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            </div>
            <Link to="/words/create" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
        </div>
        </main>
      </div>
    );
  }
}

export let Add = ParentCreate;
export let Get = View;
export let setStudent = AlumnCreate;
export let Words = Word;
export let Terms = Term;
