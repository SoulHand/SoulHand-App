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
  public download: any;
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
    var str = sessionStorage.getItem("word-pending");
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
  load_word(data: any){
      console.log(data);
      this.download = {
        word: data[0],
        concepts: data[1],
        isPending: !!data[2]
      };
  }
  new_word_step1(e: React.EventHandler<any>){
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
    this.now = this.data.shift();
    this.props.router.replace(`/errors/2/words/new`);
  }
  new_word_step2(e: React.EventHandler<any>){
    var is_valid: any = document.getElementById("correct-lex");
    if(is_valid.checked){
      this.props.router.replace(`/errors/4/words/new`);
    }

  }
  new_word_step3(){
    sessionStorage.setItem("word-pending", JSON.stringify(this.data));
    this.now = this.data.shift();
    if(this.now){
      this.props.router.replace(`/errors/2/words/new`);
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
                <WordStep1 words={this.words} next={this.new_word_step1.bind(this)}/>
              );
            break;
            case "2":
              body = (
                <WordStep2 word={this.now} next={this.new_word_step2.bind(this)} session={this.session} load={this.load_word.bind(this)}/>
              );
            break;
            case "4":
              body = <WordStep3 word={this.now} next={this.new_word_step3.bind(this)} session={this.session} lexema={this.download.word.lexema._id} morphems={this.download.word.morphems.map((row) => {return row._id})}/>
            break;
          }
        break;
     }
     return body;
   }
 }


 class WordStep1 extends React.Component<{words: Array<string>, next: Function}, {}>{
    render(){
      return (
        <ModalFree title="Informe de errores">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
              <div className="mdl-cell mdl-cell--11-col">
                <h3>Lo sentimos no se han identificado {this.props.words.length} palabras</h3>
                <p>Ayudenos ha mejorar el servicio que prestamos para mejorar la información que ofrecemos a todos nuestros usuarios.</p>
                <p>Seleccione la lista de palabras que desea ayudar en su comprensión:</p>
              </div>
              <div className="mdl-cell mdl-cell--8-col">
                <ul className="demo-list-control mdl-list">
                  {this.props.words.map((word) => {
                    return (
                      <li className="mdl-list__item" key={word}>
                        <span className="mdl-list__item-primary-content">
                          <i className="material-icons  mdl-list__item-avatar">chat</i>
                          {word}
                        </span>
                        <span className="mdl-list__item-secondary-action">
                          <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`select-${word}`}>
                            <input type="checkbox" id={`select-${word}`} className="mdl-checkbox__input" data-field={word} />
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
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.props.next.bind(this)}>
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalFree>
      );
    }
 }


 class WordStep2 extends React.Component<{load: Function, word: string, next: Function, session: User.session}, {word: Words.word, concepts: Array<Words.Term>, isPending:boolean}>{
   public init: boolean = false;
   componentDidMount() {
     let p1 = ajax({
       method: "GET",
       url: `${window._BASE}/v1/words/info/${this.props.word}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
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
        console.log(activity, this.props.load);
        this.props.load(activity);
        this.setState({
          word: activity[0],
          concepts: activity[1],
          isPending: !!activity[2]
        });
      });
      componentHandler.upgradeAllRegistered();
    }
    componentDidUpdate(){
      componentHandler.upgradeAllRegistered();
    }
    render(){
      if (!this.init) {
        return (<ModalFree />);
      }
      return (
        <ModalFree title="Informe de errores">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
              <div className="mdl-cell mdl-cell--11-col">
                <h3>{this.state.word.key}</h3>
                <p><b>Lexema o raíz: </b> {this.state.word.lexema.key}</p>
                <p><b>Morfemas: </b> {this.state.word.morphems.map((row) => {
                  return row.key
                }).join(", ")}</p>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                {this.state.word.concepts.map((row) => {
                  return (
                    <span className="mdl-chip" key={row._id}>
                      <span className="mdl-chip__text" title={row.key}>{row.value}</span>
                    </span>
                  );
                })}
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                ¿Es correcta la siguiente información léxica?
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor="correct-lex">
                  <input type="checkbox" id="correct-lex" className="mdl-switch__input" />
                  <span className="mdl-switch__label">No/Si</span>
                </label>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <div className="mdl-cell mdl-cell--9-col">
                </div>
                <div className="mdl-cell mdl-cell--2-col">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.props.next.bind(this)}>
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalFree>
      );
    }
 }

class Form extends FormUtils<{ word: string, next: Function, session: User.session, lexema: string, morphems: Array<string>}, {error: compat.Map, word?: Words.word, concepts?: Array<Words.Term>, isPending?: boolean}>{
   public init: boolean = false;
   state: {error: compat.Map, word?: Words.word, concepts?: Array<Words.Term>, isPending?: boolean} = {
      error:{
        error: null,
        words: []
      },
      word: null,
      isPending: false,
      concepts: []
    }
 }

 class WordStep3 extends Form{
   public fields:compat.Map={
      name:{
        value:this.props.word,
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
        value:this.props.lexema,
        required:true
      },
      morphem:{
        match:(fn:Array<string>)=>{
          return fn.length > 0;
        },
        value:this.props.morphems,
        required:true
      },
      words:{
        value:null,
        required:true
      }
    };
    public concept: any = {
      key: "",
      value: ""
    };
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
      values.morphem = JSON.stringify(values.morphem);
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
          success:(data:Words.word)=>{
            this.props.next(data);
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
    componentDidMount() {
     let p1 = ajax({
       method: "GET",
       url: `${window._BASE}/v1/terms?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
       dataType: "json",
       data: null,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       }
      });
      p1.done((activity: Array<Words.Term>) => {
        this.init = true;
        this.setState({
          concepts: activity
        });
      });
      componentHandler.upgradeAllRegistered();
    }
    addKey(e: React.EventHandler<any>): any {
      if (this.concept.key.trim() == "") {
        this.state.error.term = true;
        this.setState({ error: this.state.error });
        return null;
      }
      this.fields.term.value.push(this.concept.key);
      this.fields.term.labels.push(this.concept.value);
      this.concept = {
        key: "",
        value: ""
      };
      this.forceUpdate();
    }
    componentDidUpdate(){
      componentHandler.upgradeAllRegistered();
    }
    deleteItem(id: number) {
      this.fields.term.value.splice(id, 1);
      this.fields.term.labels.splice(id, 1);
      this.forceUpdate();
    }
    getConcept(e: any){
      this.concept.key = e.target.value;
      this.concept.value = e.target.selectedOptions[0].label;
      this.state.error.words = false;
      this.setState({ error: this.state.error });
    }
    render(){
      if (!this.init) {
        return (<ModalFree />);
      }
      return (
        <ModalFree title="Informe de errores">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
              <div className="mdl-cell mdl-cell--11-col">
                <h3>{this.props.word}</h3>
              </div>
              <div className="mdl-cell mdl-cell--10-col">
                <p>La definición conceptual de una palabra nos ayudará a realizar mejor una comprensión lectora del contenido de las actividades y objetivos, por lo que incrementará el conocimiento colectivo del sistema.</p>
              </div>
              <div className="mdl-cell mdl-cell--10-col">
                <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.description) ? 'is-invalid' : '')}>
                  <textarea className="mdl-textfield__input" id="description" onChange={(e: any) => { this.getFields(e) }} />
                  <label className="mdl-textfield__label" htmlFor="description">Definición del termino*</label>
                  <span className="mdl-textfield__error">Es necesaria una definición</span>
                </div>
              </div>
              <div className="mdl-cell--9-col mdl-cell--middle mdl-cell--3-col-phone" style={{ marginRight: "5px" }}>
                <div className="mdl-grid">
                  <div className="mdl-cell--7-col mdl-cell--middle" style={{ marginRight: "5px" }}>
                    <div className={"mdl-textfield mdl-textfield " + ((this.state.error.term) ? 'is-invalid' : '')}>
                      <label className="label static" htmlFor="term">Función gramátical</label>
                      <select className="mdl-textfield__input" id="term" onChange={this.getConcept.bind(this)}>
                        <option value="">Seleccione una opción</option>
                        {this.state.concepts.map((row: any) => {
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
              <div className="mdl-cell--12-col mdl-cell--middle">
                {
                  this.fields.term.value.map((row: any, index: number) => {
                    return (
                      <span className="mdl-chip" key={index}>
                        <span className="mdl-chip__text">{this.fields.term.labels[index]}</span>
                        <button type="button" className="mdl-chip__action" onClick={this.deleteItem.bind(this, index)}><i className="material-icons">cancel</i></button>
                      </span>
                    );
                  })
                }
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <div className="mdl-cell mdl-cell--9-col">
                </div>
                <div className="mdl-cell mdl-cell--2-col">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.send.bind(this)}>
                    Siguiente
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalFree>
      );
    }
 }