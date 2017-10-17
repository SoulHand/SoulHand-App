import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp, ModalFree } from "../app"
import {ajax} from 'jquery'

@withRouter
export class Words extends FormUtils<Props.GenericRouter, {}>{
  public words: Array<string> = [];
  public init: boolean = false;
  public data: any;
  public now: any;
  public fields:compat.Map={
    age:{
      match:validator.isFloat(),
      value:null,
      required:true
    }
  };
  state: {error: compat.Map} = {
    error:{
      error: null,
      words: []
    }
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
    this.setState(this.state);
    if (error) {
      return;
    }
    values.domain = this.props.routeParams.domain;
    values.level = this.props.routeParams.level;
    values.is_correct = !!values.is_correct;
    values.is_observable = !!values.is_observable;
    ajax({
			method:"POST",
	        url: `${window._BASE}/v1/physic/static/weight/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
          data:values,
          beforeSend: () => {
            window.progress.start();
            _button.disabled = true;
          },
          complete: () => {
            window.progress.done();
            _button.disabled = false;
          },
	        success:(data: CRUD.objetive)=>{
	        	this.props.router.replace(`/physic`);
	        },
	        error:(data:any)=>{
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
  constructor(props: Props.GenericRouter){
    super(props);
    var str = localStorage.getItem("word-pending");
    var _words: Array<string> = JSON.parse(str);
    if (_words) {
      this.words = _words;
    }
    this.words = this.words.filter((word, index: Number) => {
      return this.words.filter((word2, index2: Number) => {
        return word2 == word && index != index2;
      }).length == 0;
    });
  }
  load_new_word_step2(){
    this.init = false;
    this.now = this.data.shift();
    let p1 = ajax({
      method: "GET",
      url: `${window._BASE}/v1/words/info/${this.now}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done((activity: any) => {
      this.init = true;
      console.log(activity);
    });
  }
  new_word_step1(){
    var _words = document.querySelectorAll("input[data-field]:checked");
    var keywords = [];
    if(_words.length == 0){
      var config = {
        message: "Seleccione al menos 1 palabra",
        timeout: window.settings.alert.delay
      };
      var message: any = document.querySelector('.mdl-js-snackbar')
      message.MaterialSnackbar.showSnackbar(config);
      return;
    }
    for (var i = 0, n = _words.length; i<n; i++) {
      var element = _words[i];
      keywords[i] = element.getAttribute("data-field");
    }
    this.data = keywords;
    this.props.router.replace(`/errors/2/words/new`);
  }
  componentWillReceiveProps(prev: any, next: any){
    console.log(prev);
    switch(prev.routeParams.type){
      case "new":
        switch(prev.routeParams.step){
          case "2":
            this.load_new_word_step2();
          break;
        }
      break;
    }
  }
  componentDidMount(){
    componentHandler.upgradeAllRegistered();
  }
  componentDidUpdate(){
    componentHandler.upgradeAllRegistered();
  }
   render(){
     if(this.words.length == 0){
       return(
        <ModalFree title="Informe de errores">
          <div className="mdl-grid mdl-color--white demo-content">
            <h1>No se ha detectado problemas!</h1>
          </div>
        </ModalFree>
       );
     }
     var body = (
        <ModalFree title="Informe de errores">
           No existe!
        </ModalFree>
     );
     switch(this.props.routeParams.type){
        case "new":
          switch(this.props.routeParams.step){
            case "1":
              body = (
                <ModalFree title="Informe de errores">
                  <div className="mdl-grid demo-content">
                    <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
                      <div className="mdl-cell mdl-cell--11-col">
                        <h3>Lo sentimos no se han identificado {this.words.length} palabras</h3>
                        <p>Ayudenos ha mejorar el servicio que prestamos para mejorar la información que ofrecemos a todos nuestros usuarios.</p>
                        <p>Seleccione la lista de palabras que desea ayudar en su comprensión:</p>
                      </div>
                      <div className="mdl-cell mdl-cell--8-col">
                        <ul className="demo-list-control mdl-list">
                          {this.words.map((word) => {
                            return (
                              <li className="mdl-list__item" key={word}>
                                <span className="mdl-list__item-primary-content">
                                  <i className="material-icons  mdl-list__item-avatar">chat</i>
                                  {word}
                                </span>
                                <span className="mdl-list__item-secondary-action">
                                  <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`select-${word}`}>
                                    <input type="checkbox" id={`select-${word}`} className="mdl-checkbox__input" data-field={word}/>
                                  </label>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="mdl-cell mdl-cell--11-col mdl-grid">
                        <div className="mdl-cell mdl-cell--9-col">
                        </div>
                        <div className="mdl-cell mdl-cell--2-col">
                          <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.new_word_step1.bind(this)}>
                            Siguiente
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalFree>
              );
            break;
            case "2":
            if(this.init){
                body = (
                  <ModalFree title="Informe de errores">
                    <div className="mdl-grid demo-content">
                      <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
                        <div className="mdl-cell mdl-cell--11-col">
                          <h3>Lo sentimos no se han identificado {this.words.length} palabras</h3>
                          <p>Ayudenos ha mejorar el servicio que prestamos para mejorar la información que ofrecemos a todos nuestros usuarios.</p>
                          <p>Seleccione la lista de palabras que desea ayudar en su comprensión:</p>
                        </div>
                        <div className="mdl-cell mdl-cell--8-col">
                          <ul className="demo-list-control mdl-list">
                            {this.words.map((word) => {
                              return (
                                <li className="mdl-list__item" key={word}>
                                  <span className="mdl-list__item-primary-content">
                                    <i className="material-icons  mdl-list__item-avatar">chat</i>
                                    {word}
                                  </span>
                                  <span className="mdl-list__item-secondary-action">
                                    <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`select-${word}`}>
                                      <input type="checkbox" id={`select-${word}`} className="mdl-checkbox__input" data-field={word}/>
                                    </label>
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                        <div className="mdl-cell mdl-cell--11-col mdl-grid">
                          <div className="mdl-cell mdl-cell--9-col">
                          </div>
                          <div className="mdl-cell mdl-cell--2-col">
                            <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.new_word_step1.bind(this)}>
                              Siguiente
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ModalFree>
                );
            }else{
              body = <ModalFree/>;
            }
            break;
          }
        break;
     }
     return body;
   }
 }
