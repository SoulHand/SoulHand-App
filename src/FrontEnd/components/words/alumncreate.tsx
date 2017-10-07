import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'

@withRouter
 export class AlumnCreate extends FormUtils<{router: any, routeParams: any}, {}>{
  public fields: compat.Map = {
    name: {
      match: (fn: string) => {
        return !validator.isNull()(fn);
      },
      value: null,
      required: true
    },
    concept: {
      match: (fn: string) => {
        return !validator.isNull()(fn);
      },
      value: null,
      required: true
    },
    genero: {
      value: null,
      required: false
    },
    count: {
      value: null,
      required: false
    },
    time: {
      value: null,
      required: false
    },
    type: {
      match: (fn: string) => {
        return !validator.isNull()(fn);
      },
      value: null,
      required: false
    },
    mode: {
      match: (fn: string) => {
        return !validator.isNull()(fn);
      },
      value: null,
      required: false
    },
    regexp: {
      value: null
    }
  };
  state: { error: compat.Map } = {
    error: {},
  }
  send(event: any) {
    var values: compat.Map = {};
    var error = false;
    for (var i in this.fields) {
      this.state.error[i] = !super.validate(this.fields[i].value, i);
      values[i] = this.fields[i].value;
      error = error || this.state.error[i];
    }
    this.setState(this.state);
    if (error) {
      return;
    }
    ajax({
      method: "POST",
      url: `${window._BASE}/v1/words/lexemas/${this.props.routeParams.id}/morphemas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: values,
      success: (data: any) => {
        this.props.router.replace(`/words/get/${this.props.routeParams.id}`);
      },
      error: (data: any) => {
        var state: CRUD.codeError = data.responseJSON;
        var config = {
          message: state.message,
          timeout: 2000
        };
        var message: any = document.querySelector('.mdl-js-snackbar')
        message.MaterialSnackbar.showSnackbar(config);
      }
    });
  }
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  render() {
    return (
      <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
        <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
          <div className="mdl-layout__drawer-button"><Link to={`/words/get/${this.props.routeParams.id}`}><i className="material-icons">&#xE5C4;</i></Link></div>
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">SoulHand</span>
            <div className="mdl-layout-spacer"></div>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" onClick={(e: any) => { this.send(e) }}>
              <i className="material-icons">check</i>
            </button>

          </div>
        </header>
        <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid mdl-color--white demo-content">
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
                <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
                <label className="mdl-textfield__label" htmlFor="name">Nombre*</label>
                <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                <textarea className="mdl-textfield__input" id="regexp" onChange={(e: any) => { this.getFields(e) }} />
                <label className="mdl-textfield__label" htmlFor="regexp">Expresión regular (solo desarrolladores)</label>
                <span className="mdl-textfield__error">No se admite la expresión</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                <select className="mdl-textfield__input" id="type" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {Object.keys(window.WORDS.TYPE_MORPHEMS).map((row) => {
                    var MORPHES: any = window.WORDS.TYPE_MORPHEMS;
                    return (
                      <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>                      
                    );
                  })}
                </select>
                <label className="mdl-textfield__label" htmlFor="regexp">Tipo de morfema</label>
                <span className="mdl-textfield__error">No se admite la expresión</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                <select className="mdl-textfield__input" id="mode" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {Object.keys(window.WORDS.MODE_MORPHEMS).map((row) => {
                    var MORPHES: any = window.WORDS.MODE_MORPHEMS;
                    return (
                      <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>                      
                    );
                  })}
                </select>
                <label className="mdl-textfield__label" htmlFor="regexp">Tipo de morfema</label>
                <span className="mdl-textfield__error">No se admite la expresión</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                <select className="mdl-textfield__input" id="time" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {Object.keys(window.WORDS.TIMES).map((row) => {
                    var MORPHES: any = window.WORDS.TIMES;
                    return (
                      <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
                    );
                  })}
                </select>
                <label className="mdl-textfield__label" htmlFor="time">Tiempo gramatical</label>
                <span className="mdl-textfield__error">No se admite la expresión</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                <select className="mdl-textfield__input" id="concept" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {Object.keys(window.WORDS.CONCEPTS).map((row) => {
                    var MORPHES: any = window.WORDS.CONCEPTS;
                    return (
                      <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
                    );
                  })}
                </select>
                <label className="mdl-textfield__label" htmlFor="concept">clasificación gramatical</label>
                <span className="mdl-textfield__error">No se admite la expresión</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                <select className="mdl-textfield__input" id="genero" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {Object.keys(window.WORDS.GENERO).map((row) => {
                    var MORPHES: any = window.WORDS.GENERO;
                    return (
                      <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
                    );
                  })}
                </select>
                <label className="mdl-textfield__label" htmlFor="genero">Genero gramatical</label>
                <span className="mdl-textfield__error">No se admite la expresión</span>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                <select className="mdl-textfield__input" id="count" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {Object.keys(window.WORDS.COUNT).map((row) => {
                    var MORPHES: any = window.WORDS.COUNT;
                    return (
                      <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
                    );
                  })}
                </select>
                <label className="mdl-textfield__label" htmlFor="count">Numero gramatical</label>
                <span className="mdl-textfield__error">No se admite la expresión</span>
              </div>
            </div>            
          </div>
        </main>
      </div>
    );
  }
 }
