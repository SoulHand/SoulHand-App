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
    concepts: {
      match: (fn: string) => {
        return !validator.isNull()(fn);
      },
      value: [],
      required: true
    },
    regexp: {
      value: null
    }
  };
  public concept: any = {
    key: "",
    value: ""
  };
  state: { error: compat.Map } = {
    error: {},
  }
  send(event: any) {
    var values: compat.Map = {};
    var error = false;
    this.fields.concepts.value = JSON.stringify(this.fields.concepts.value);
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
  deleteItem(id: number){
    this.fields.concepts.value.splice(id, 1);
    this.forceUpdate();
  }
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  render() {
    var keys = null;
    console.log(this.fields.concepts);
     switch (this.concept.key){
       case window.WORDS.CONCEPTS.TIME:
         keys = Object.keys(window.WORDS.TIMES).map((row) => {
           var MORPHES: any = window.WORDS.TIMES;
           return (
             <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
           );
         })
       break;
       case window.WORDS.CONCEPTS.COUNT:
         keys = Object.keys(window.WORDS.COUNT).map((row) => {
           var MORPHES: any = window.WORDS.COUNT;
           return (
             <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
           );
         })
       break;
       case window.WORDS.CONCEPTS.GENERO:
         keys = Object.keys(window.WORDS.GENERO).map((row) => {
           var MORPHES: any = window.WORDS.GENERO;
           return (
             <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
           );
         })
       break;
       case window.WORDS.CONCEPTS.CLASS:
         keys = Object.keys(window.WORDS.CLASS_GRAMATICAL).map((row) => {
           var MORPHES: any = window.WORDS.CLASS_GRAMATICAL;
           return (
             <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
           );
         })
       break;
     }
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
              <h1>Añadir un Morfema</h1>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className="mdl-cell mdl-cell--12-col">
                <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
                  <input className="mdl-textfield__input" type="text" id="name" onChange={(e: any) => { this.getFields(e) }} />
                  <label className="mdl-textfield__label" htmlFor="name">Nombre*</label>
                  <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
                </div>
              </div>
              <div className="mdl-cell mdl-cell--12-col">
                <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                  <textarea className="mdl-textfield__input" id="regexp" onChange={(e: any) => { this.getFields(e) }} />
                  <label className="mdl-textfield__label" htmlFor="regexp">Expresión regular (solo desarrolladores)</label>
                  <span className="mdl-textfield__error">No se admite la expresión</span>
                </div>
              </div>
            </div>
            <div className="mdl-cell--4-col mdl-cell--middle">
              <label className="label static" htmlFor="regexp">Tipo de concepto</label>
              <select className="mdl-textfield__input" id="key" onChange={(e) => {
                  this.concept.key = e.target.value;
                  this.forceUpdate();
                }}>
                  <option value="">Seleccione una opción</option>
                  {Object.keys(window.WORDS.CONCEPTS).map((row) => {
                    var MORPHES: any = window.WORDS.CONCEPTS;
                    return (
                      <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
                    );
                  })}
                </select>
            </div>
            <div className="mdl-cell--4-col mdl-cell--middle">
                <label className="label static" htmlFor="regexp">Valor</label>
                <select className="mdl-textfield__input" id="value" onChange={(e) => {
                    this.concept.value = e.target.value;
                  }}>
                  <option value="">Seleccione una opción</option>
                  {keys}
                </select>
            </div>
            <div className="mdl-cell--4-col mdl-cell--middle">
              <button id="add-keyword" className="mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onClick={(e) => {
                  this.fields.concepts.value.push({
                    key: this.concept.key,
                    value: this.concept.value
                  });
                  this.concept = {
                    key: "",
                    value: ""
                  };
                  this.forceUpdate();
                }}>
                <i className="material-icons">add</i>
              </button>
              <div className="mdl-tooltip" data-mdl-for="add-keyword">
                Añadir una palabra clave
              </div>
            </div>
            <div className="mdl-cell--10-col mdl-cell--middle">
              {this.fields.concepts.value.map((row: any, index: number) => {
                return (
                  <span className="mdl-chip" key={row.key + index}>
                    <span className="mdl-chip__text">{row.value}</span>
                    <button type="button" className="mdl-chip__action" onClick={this.deleteItem.bind(this, index)}><i className="material-icons">cancel</i></button>
                  </span>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    );
  }
 }
