import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import { App, ModalApp } from '../app'

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
        return fn.length > 0;
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
  public titles: Array<string> = [];
  state: { error: compat.Map } = {
    error: {},
  }
  send(event: any) {
    var values: compat.Map = {};
    var error = false;
    var _button = event.target;
    for (var i in this.fields) {
      this.state.error[i] = !super.validate(this.fields[i].value, i);
      values[i] = this.fields[i].value;
      error = error || this.state.error[i];
    }
    this.setState(this.state);
    if (error) {
      return;
    }
    values.concepts = JSON.stringify(values.concepts);
    ajax({
      method: "POST",
      url: `${window._BASE}/v1/words/lexemas/${this.props.routeParams.id}/morphemas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: values,
      beforeSend: () => {
        window.progress.start();
        _button.disabled = true;
      },
      complete: () => {
        window.progress.done();
        _button.removeAttribute("disabled");
      },
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
  deleteItem(id: number) {
    this.fields.concepts.value.splice(id, 1);
    this.titles.splice(id, 1);
    this.forceUpdate();
  }
  componentDidMount() {
    componentHandler.upgradeAllRegistered();
  }
  addKey(e: React.EventHandler<any>): any {
    if (this.concept.key.trim() == "" || this.concept.value.trim() == "") {
      this.state.error.key = this.concept.key.trim() == "";
      this.state.error.value = this.concept.value.trim() == "";
      this.setState({ error: this.state.error });
      return null;
    }
    this.fields.concepts.value.push({
      key: this.concept.key,
      value: this.concept.value
    });
    this.titles.push(this.concept.value);
    this.concept = {
      key: "",
      value: "",
    };
    this.forceUpdate();
  }
  render() {
    var keys = null;
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
      <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir un morfema">
        <div className="mdl-grid mdl-color--white">
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
              <label className="mdl-textfield__label" htmlFor="regexp">Expresión regular (solo desarrolladores)*</label>
              <span className="mdl-textfield__error">La expresión es invalida</span>
            </div>
          </div>
          <div className="mdl-cell--10-col mdl-cell--middle">
            <div className="mdl-grid">
              <div className="mdl-cell--5-col mdl-cell--middle" style={{ marginRight: "5px" }}>
                <div className={"mdl-textfield mdl-textfield " + ((this.state.error.key || this.state.error.concepts) ? 'is-invalid' : '')}>
                  <label className="label static" htmlFor="key">Tipo de concepto</label>
                  <select className="mdl-textfield__input" id="key" onChange={(e) => {
                    this.concept.key = e.target.value;
                    //this.concept.value = e.target.selectedOptions[0].label;
                    this.state.error.key = false;
                    this.setState({ error: this.state.error });
                  }} value={this.concept.key}>
                    <option value="">Seleccione una opción</option>
                    {Object.keys(window.WORDS.CONCEPTS).map((row) => {
                      var MORPHES: any = window.WORDS.CONCEPTS;
                      return (
                        <option key={row} value={MORPHES[row]}>{MORPHES[row]}</option>
                      );
                    })}
                  </select>
                  <span className="mdl-textfield__error">Es necesario un concepto gramátical</span>
                </div>
              </div>
              <div className="mdl-cell--5-col mdl-cell--middle mdl-cell--3-col-phone" style={{ marginRight: "5px" }}>
                <div className={"mdl-textfield mdl-textfield " + ((this.state.error.value) ? 'is-invalid' : '')}>
                  <label className="label static" htmlFor="value">Valor</label>
                  <select className="mdl-textfield__input" id="value" onChange={(e) => {
                    this.concept.value = e.target.value;
                    //this.concept.value = e.target.selectedOptions[0].label;
                    this.state.error.value = false;
                    this.setState({ error: this.state.error });
                  }} value={this.concept.value}>
                    <option value="">Seleccione una opción</option>
                    {keys}
                  </select>
                  <span className="mdl-textfield__error">Es necesario un concepto gramátical</span>
                </div>
              </div>
              <div className="mdl-cell--1-col mdl-cell--middle">
                <button id="add-keyword" className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" onClick={this.addKey.bind(this)}>
                  <i className="material-icons">add</i>
                </button>
              </div>
            </div>
          </div>
          <div className="mdl-cell--1-col mdl-cell--middle" style={{ marginLeft: "5px" }}>
            <div className="mdl-tooltip" data-mdl-for="add-keyword">
              Añadir una palabra clave
              </div>
          </div>
          <div className="mdl-cell--12-col mdl-cell--middle">
            {this.fields.concepts.value.map((row: any, index: number) => {
              return (
                <span className="mdl-chip" key={index}>
                  <span className="mdl-chip__text">{this.titles[index]}</span>
                  <button type="button" className="mdl-chip__action" onClick={this.deleteItem.bind(this, index)}><i className="material-icons">cancel</i></button>
                </span>
              );
            })}
          </div>
        </div>
      </ModalApp>
    );
  }
 }
