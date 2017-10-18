import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../../formutils'
import {ajax} from 'jquery'
import { App, ModalApp } from '../../app'

@withRouter
 export class ParentCreate extends FormUtils<{router: any}, any>{
    public init: boolean = false;
    public concept: any = {
      key: "",
      value: ""
    };
    public titles: Array<string> = [];
    public fields:compat.Map={
      name:{
        match:(fn:string)=>{
          return !validator.isNull()(fn);
        },
        value:null,
        required:true
      },
      term:{
        match:(fn:Array<string>)=>{
          return fn.length > 0;
        },
        value:[],
        labels:[],
        required:true
      },
      description:{
        match:(fn:string)=>{
          return !validator.isNull()(fn);
        },
        value:null,
        required:true
      },
      lexem:{
        match:(fn:string)=>{
          return !validator.isNull()(fn);
        },
        value:null,
        required:true
      },
      morphem:{
        match:(fn:string)=>{
          return !validator.isNull()(fn);
        },
        value:null,
        required:true
      },
      words:{
        value:null,
        required:true
      }
    };
    public term: string = "";
    public label: string = "";
    state: { error: compat.Map, terms: Array<Words.Term>, lexems: Array<Words.Lexema>, morphems: Array<Words.Morphema>} = {
      error:{},
      terms: null,
      lexems: [],
      morphems: []
    }
    send(event: any){
      var values: compat.Map = {};
      var error = false;
      var _button = event.target;
      for(var i in this.fields){
        this.state.error[i] = !super.validate(this.fields[i].value, i);
        values[i] = this.fields[i].value;
        error = error || this.state.error[i];
      }
      if (error) {
        this.setState(this.state);
        return;
      }
      values.term = JSON.stringify(values.term);
      ajax({
          method:"POST",
          url: `${window._BASE}/v1/words/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
          dataType: "json",
          data:values,
          beforeSend: () => {
            window.progress.start();
            _button.disabled = true;
          },
          complete: () => {
            window.progress.done();
            _button.removeAttribute("disabled");
          },
          success:(data:any)=>{
            this.props.router.replace('/words/words');
          },
          error: (data: any) => {
            var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: window.settings.alert.delay
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            message.MaterialSnackbar.showSnackbar(config);
          }
      });
    }
    deleteItem(id: number) {
      this.fields.term.value.splice(id, 1);
      this.titles.splice(id, 1);
      this.forceUpdate();
    }
    componentDidMount() {
      let p1 = ajax({
        method: "GET",
        url: `${window._BASE}/v1/terms/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data: null,
        beforeSend: () => {
          window.progress.start();
        },
        complete: () => {
          window.progress.done();
        },
        error: (data: any) => {
          var state: CRUD.codeError = data.responseJSON;
          var config = {
            message: state.message,
            timeout: window.settings.alert.delay
          };
          var message: any = document.querySelector('.mdl-js-snackbar')
          message.MaterialSnackbar.showSnackbar(config);
        }
      }), p2 = ajax({
        method: "GET",
        url: `${window._BASE}/v1/words/lexemas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data: null,
        beforeSend: () => {
          window.progress.start();
        },
        complete: () => {
          window.progress.done();
        },
        error: (data: any) => {
          var state: CRUD.codeError = data.responseJSON;
          var config = {
            message: state.message,
            timeout: window.settings.alert.delay
          };
          var message: any = document.querySelector('.mdl-js-snackbar')
          message.MaterialSnackbar.showSnackbar(config);
        }
      });
      window.Promise.all([p1.done(), p2.done()]).then((data: any) => {
        this.init = true;
        this.setState({
          terms: data[0],
          lexems: data[1]
        });
      });
    }
    componentDidUpdate(){
      componentHandler.upgradeAllRegistered();
    }
    addKey(e: React.EventHandler<any>): any {
      if (this.concept.key.trim() == "") {
        this.state.error.term = true;
        this.setState({ error: this.state.error });
        return null;
      }
      this.fields.term.value.push(this.concept.key);
      this.titles.push(this.concept.value);
      this.concept = {
        key: "",
        value: ""
      };
      this.forceUpdate();
    }
    MoveLexem(e: any){
      this.getFields(e);
      var morphems: any = [];
      this.state.lexems.forEach(element => {
        if(element._id == this.fields.lexem.value){
          morphems = element.morphems;
          return;
        }
      });
      this.setState({morphems: morphems});
    }
    render() {
      if (!this.init) {
        return (
          <ModalApp success={(e: any) => { console.warn("Esperando") }} label="Aceptar" />
        );
      }
      return (
        <ModalApp success={(e: any) => { this.send(e) }} label="Aceptar" title="Añadir una palabra">
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
                <textarea className="mdl-textfield__input" id="description" onChange={(e: any) => { this.getFields(e) }} />
                <label className="mdl-textfield__label" htmlFor="description">Descripción*</label>
                <span className="mdl-textfield__error">Es necesaria una descripción</span>
              </div>
            </div>
            <div className="mdl-cell--6-col mdl-cell--middle mdl-cell--3-col-phone">
              <div className={"mdl-textfield mdl-textfield " + ((this.state.error.lexem) ? 'is-invalid' : '')}>
                <label className="label static" htmlFor="lexem">Lexema</label>
                <select className="mdl-textfield__input" id="lexem" onChange={(e: any) => { this.MoveLexem(e) }}>
                  <option value="">Seleccione una opción</option>
                  {this.state.lexems.map((row) => {
                    return (
                      <option key={row._id} value={row._id}>{row.key}</option>

                    )
                  })}
                </select>
                <span className="mdl-textfield__error">Es necesario un concepto</span>
              </div>
            </div>
            <div className="mdl-cell--6-col mdl-cell--middle mdl-cell--3-col-phone">
              <div className={"mdl-textfield mdl-textfield " + ((this.state.error.morphem) ? 'is-invalid' : '')}>
                <label className="label static" htmlFor="morphem">Morfema*</label>
                <select className="mdl-textfield__input" id="morphem" onChange={(e: any) => { this.getFields(e) }}>
                  <option value="">Seleccione una opción</option>
                  {this.state.morphems.map((row) => {
                    return (
                      <option key={row._id} value={row._id}>{row.key}</option>
                    )
                  })}
                </select>
                <span className="mdl-textfield__error">Es necesario un concepto</span>
              </div>
            </div>
            <div className="mdl-cell--6-col mdl-cell--middle">
              <div className="mdl-grid">
                <div className="mdl-cell--9-col mdl-cell--middle mdl-cell--3-col-phone" style={{ marginRight: "5px" }}>
                  <div className={"mdl-textfield mdl-textfield " + ((this.state.error.term) ? 'is-invalid' : '')}>
                    <label className="label static" htmlFor="term">Categoría gramátical</label>
                    <select className="mdl-textfield__input" id="term" onChange={(e) => {
                      this.concept.key = e.target.value;
                      this.concept.value = e.target.selectedOptions[0].label;
                      this.state.error.words = false;
                      this.setState({ error: this.state.error });
                    }} value={this.concept.key}>
                      <option value="">Seleccione una opción</option>
                      {this.state.terms.map((row: any) => {
                        return (
                          <option key={row._id} value={row._id}>{row.concept}</option>

                        )
                      })}
                    </select>
                    <span className="mdl-textfield__error">Es necesario un concepto</span>
                  </div>
                </div>
                <div className="mdl-cell--1-col mdl-cell--middle">
                  <button id="add-keyword" className="mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-button--colored" onClick={this.addKey.bind(this)}>
                    <i className="material-icons">add</i>
                  </button>
                </div>
              </div>
            </div>
            <div className="mdl-cell mdl-cell--6-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.words) ? 'is-invalid' : '')}>
                <textarea className="mdl-textfield__input" id="words" onChange={(e: any) => { this.getFields(e) }} />
                <label className="mdl-textfield__label" htmlFor="words">Sinonimo (valido separadores)</label>
                <span className="mdl-textfield__error">Las palabras deben estar separadas por coma (,)</span>
              </div>
            </div>
            <div className="mdl-cell--1-col mdl-cell--middle" style={{ marginLeft: "5px" }}>
              <div className="mdl-tooltip" data-mdl-for="add-keyword">
                Añadir una palabra clave
              </div>
            </div>
            <div className="mdl-cell--12-col mdl-cell--middle">
              {
                this.fields.term.value.map((row: any, index: number) => {
                  return (
                    <span className="mdl-chip" key={index}>
                      <span className="mdl-chip__text">{this.titles[index]}</span>
                      <button type="button" className="mdl-chip__action" onClick={this.deleteItem.bind(this, index)}><i className="material-icons">cancel</i></button>
                    </span>
                  );
                })
              }
            </div>
          </div>
        </ModalApp>
      );
    }
 }
