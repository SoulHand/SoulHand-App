import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import { ModalApp, ModalFree } from "../app"
import {ajax} from 'jquery'


interface ErrorReport {
  words: Array<string>,
  error: {
    code: string,
    message: string
  },
  datas: any
}

@withRouter
export class Objetives extends FormUtils<Props.GenericRouter, {}>{
  public words: Array<string> = [];
  public static: Array<string> = [];
  public init: boolean = false;
  public data: any;
  public error: ErrorReport;
  public now: any;
  public save: any;
  public download: any;
  public words_query: any;
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
  constructor(props: Props.GenericRouter){
    super(props);
    var str = sessionStorage.getItem("objetive-pending");
    var _error: ErrorReport = JSON.parse(str);
    this.error = _error;
    this.words = _error.words;
  }
  load_word(data: any){
      this.download = {
        word: data[0],
        concepts: data[1],
        isPending: !!data[2]
      };
      if (!data[0]){
        this.props.router.push(`/errors/1/words/new`);
        return;
      }
      this.words_query = {
        key: data[0].key
      }
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
    this.static = keywords.slice();
    this.data = keywords;
    this.now = this.data.shift();
    this.props.router.replace(`/errors/2/objetives/new`);
  }
  new_word_step2(e: any){
    this.words_query.data = e;
    var _datas:compat.Map = {};
    for(var i = 0, n = e.length; i<n; i++){
      _datas[e[i].name] = e[i].value;
    }
    _datas.key = this.words_query.key;
    ajax({
      method: "POST",
      url: `${window._BASE}/v1/knowedge/objetives/datas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: _datas,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      },
      success: (data: Words.Lexema) => {
        this.now = this.data.shift();
        if (this.now) {
          this.forceUpdate();
          return;
        }
        this.props.router.replace(`/errors/3/objetives/new`);
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
  new_word_step3(){
    this.props.router.replace(`/errors/4/objetives/new`);
  }
  new_word_step4(e: CRUD.objetive){
    sessionStorage.removeItem("objetive-pending");
    this.save = e;
    this.props.router.replace(`/errors/6/objetives/new`);  
  }
  new_word_step5(isValid: boolean){
    if (isValid) {
      this.props.router.replace(`/errors/5/objetives/new`);
      return;
    }
    this.props.router.replace(`/errors/6/objetives/new`);
    sessionStorage.removeItem("objetive-pending");
    this.save = null;
  }
  componentDidMount(){
    componentHandler.upgradeAllRegistered();
  }
  componentDidUpdate(){
    componentHandler.upgradeAllRegistered();
  }
  finish(){
    if(!this.save){
      window.history.back();
      return;
    }
    this.props.router.replace(`/objetives/get/${this.save._id}`);
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
            case "3":
              body = <WordStep3 word={this.now} next={this.new_word_step3.bind(this)} session={this.session} keywords={this.static}/>
            break;
            case "4":
              body = <WordStep5 next={this.new_word_step5.bind(this)} data={this.error.datas}/>
            break;
            case "5":
              body = <WordStep4 word={this.now} next={this.new_word_step4.bind(this)} session={this.session} keywords={this.static} data={this.error.datas}/>
            break;
            case "6":
              body = (
                <ModalFree title="Informe de errores">
                  <div className="mdl-grid demo-content">
                    <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
                      <div className="mdl-cell mdl-cell--11-col">
                        <h3>Felicidades</h3>
                        <p>Ha completado el aprendizaje colectivo SoulHand, con su ayuda podremos mejorar el resultado de las inferencias generadas.</p>
                      </div>
                      <div className="mdl-cell mdl-cell--11-col mdl-grid">
                        <div className="mdl-cell mdl-cell--9-col">
                        </div>
                        <div className="mdl-cell mdl-cell--2-col">
                          <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.finish.bind(this)}>
                            Finalizar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </ModalFree>  
              );
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
                <h3>Lo sentimos no se procesó el objetivo</h3>
                <p>Ayudenos ha mejorar el servicio que prestamos para mejorar la información que ofrecemos a todos nuestros usuarios.</p>
                <p>Seleccione la lista de palabras claves ha evaluar:</p>
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

 interface Question {
   name: string,
   question: string,
   description?: string,
   match?: Function
 }

class WordStep2 extends React.Component<{ load: Function, word: string, next: Function, session: User.session }, { word: Words.word, concepts: Array<Words.Term>, isPending: boolean, question: Question}>{
   public init: boolean = false;
   public responses : Array<{name: string, value: boolean}> = [];
   public questions: Array<Question> = [];
   constructor(props:  any){
     super(props);
     this.questions = this.loadQuestion();
   }
   loadQuestion(){
     var questions: Array<Question> = [
        {
          name: "is_observable",
          question: "¿Es un verbo observable?",
          description: "El verbo denota una acción observable determinado en el tiempo. Seleccione no en caso de ser ambiguo el verbo será anulado para futuras inferencias.",
          match: () => {
            var isValid = false;
            for (var i = 0, n = this.state.word.concepts.length; i < n; i++) {
              if (this.state.word.concepts[i].value == window.WORDS.CLASS_GRAMATICAL.VERB) {
                isValid = true;
                break;
              }
            }
            return isValid;
          }
        },
        {
          name: "is_correct",
          question: "¿Es una palabra clave?",
          description: "Las palabras claves en un objetivo de aprendizaje denotan una acción, un contenido y condiciones. Si considera que la siguiente palabra no posee ninguna de las mencionadas seleccione \"no\" e ignoraremos en futuras inferencias.",
          match: () => {
            var isValid = true;
            for (var i = 0, n = this.state.word.concepts.length; i < n; i++) {
              if (this.state.word.concepts[i].value == window.WORDS.CLASS_GRAMATICAL.VERB) {
                isValid = false;
                break;
              }
            }
            return isValid;
          }
        }
      ];
     this.responses = [];
     return questions;
   }
   getQuestion():Question | boolean{
     var _question, val = true;
     if (this.questions.length == 0){
       return false;
     }
     do{
      _question = this.questions.shift();
      if (!_question){
        return false;
      }
      if (_question.match){
        val = _question.match();
      }
     }while (val != true);
     return _question;
   }
   componentDidMount() {
     this.load(this.props);
   }
   componentWillReceiveProps(props:any){
     this.init = false;
     this.questions = this.loadQuestion();
     this.load(props);
   }
   load(props: any){
     let p1 = ajax({
       method: "GET",
       url: `${window._BASE}/v1/words/info/${props.word}?PublicKeyId=${props.session.publicKeyId}&PrivateKeyId=${props.session.privateKeyId}`,
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
        this.props.load(activity);
        this.state = {
          word: activity[0],
          concepts: activity[1],
          isPending: !!activity[2],
          question: null
        };
        var _problem: any = this.getQuestion();
        if (!_problem){
          this.props.next([]);
          return;
        }
        this.setState({ question: _problem});
      });
      componentHandler.upgradeAllRegistered();
    }
    componentDidUpdate(){
      componentHandler.upgradeAllRegistered();
    }
    next(){
      var is_valid: any = document.getElementById("correct-lex");
      var _problem: any = this.getQuestion();
      this.responses.push({
        name: this.state.question.name,
        value: is_valid.checked
      });
      if (!_problem) {
        this.props.next(this.responses);
        return;
      }
      this.setState({question: _problem});
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
                <h5>Definiciones</h5>
                <ul className="demo-list-three mdl-list">
                  {this.state.concepts.map((row) => {
                    return (
                      <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                        <span className="mdl-list__item-primary-content">
                          <span title={row.description}>{row.concept}</span>
                          {row.hiponimos.map((word) => {
                            return (
                              <span className="mdl-list__item-text-body" key={word._id}>
                                {row.hiponimos[0].description}
                              </span>
                            )
                          })}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                {this.state.question.question}
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                {this.state.question.description}
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor="correct-lex">
                  <input type="checkbox" id="correct-lex" className="mdl-switch__input" />
                  <span className="mdl-switch__label">No/Si</span>
                </label>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <div className="mdl-cell mdl-cell--9-col"/>
                <div className="mdl-cell mdl-cell--2-col">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.next.bind(this)}>
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

class WordStep5 extends React.Component<{ data: any, next: Function },{}>{
    componentDidUpdate(){
      componentHandler.upgradeAllRegistered();
    }
    componentDidMount(){
      componentHandler.upgradeAllRegistered();
    }
    next(){
      var is_valid: any = document.getElementById("isValid");
      this.props.next(is_valid.checked);
    }
    render(){
      return (
        <ModalFree title="Informe de errores">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
              <div className="mdl-cell mdl-cell--11-col">
                <h3>{this.props.data.name}</h3>
                <p><b>Descripción: </b> {this.props.data.description}</p>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                ¿Es valido el siguiente objetivo?
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <label className="mdl-switch mdl-js-switch mdl-js-ripple-effect" htmlFor="isValid">
                  <input type="checkbox" id="isValid" className="mdl-switch__input" />
                  <span className="mdl-switch__label">No/Si</span>
                </label>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <div className="mdl-cell mdl-cell--9-col"/>
                <div className="mdl-cell mdl-cell--2-col">
                  <button className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.next.bind(this)}>
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

interface FormState {
  error: compat.Map
  word?: Words.word
  concepts?: Array<Words.Term>
  isPending?: boolean
  lexema?: Words.Lexema
  morphem?: Words.Morphema
  term?: Words.Term
  domains?: Array<CRUD.domain>
  levels?: Array<CRUD.level>
}

class Form extends FormUtils<{ word: string, next: Function, session: User.session, lexema?: any, morphems?: Array<string>, data?: any, keywords: Array<string> }, FormState>{
   public init: boolean = false;
   state: FormState = {
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
      exp:{
        value:this.props.word,
        required:true,
        match: (str: string) => {
          var _num = parseFloat(str);
          return _num > 0;
        }
      }
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
      values.words = JSON.stringify(this.props.keywords);
      ajax({
        method: "POST",
        url: `${window._BASE}/v1/knowedge/objetives/exp/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data: values,
        beforeSend: () => {
          window.progress.start();
          _button.disabled = true;
        },
        complete: () => {
          window.progress.done();
          _button.disabled = false;
        },
        success: (data: CRUD.objetive) => {
          this.props.next(data);
        },
        error: (data: any) => {
          var state: CRUD.codeError = data.responseJSON;
          var str = sessionStorage.getItem("words-pending");
          var _words: Array<string> = [];
          if (str) {
            _words = JSON.parse(str);
          }
          var config = {
            message: state.message.message,
            timeout: window.settings.alert.delay
          };
          var message: any = document.querySelector('.mdl-js-snackbar')
          message.MaterialSnackbar.showSnackbar(config);
        }
      });
    }
    componentDidMount(){
      componentHandler.upgradeAllRegistered();
    }
    render(){
      return (
        <ModalFree title="Informe de errores">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
              <div className="mdl-cell mdl-cell--11-col">
                <h3>Seleccione un puntaje de experiencia</h3>
              </div>
              <div className="mdl-cell mdl-cell--10-col">
                <p>Los puntos de experiencias son un puntaje infinito que determinará que tanta incertidumbre puede tener un objetivo y su dificultad para adoptar la capacidad, conducta o habilidad mencionada.</p>
              </div>
              <div className="mdl-cell mdl-cell--6-col">
                <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.exp) ? 'is-invalid' : '')}>
                  <input className="mdl-textfield__input" id="exp" onChange={(e: any) => { this.getFields(e) }} />
                  <label className="mdl-textfield__label" htmlFor="exp">Puntos de experiencia</label>
                  <span className="mdl-textfield__error">Debe ser un numero superior a cero</span>
                </div>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <div className="mdl-cell mdl-cell--9-col"/>
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

class WordStep4 extends Form{
  public init: boolean = false;
  public fields: compat.Map = {
    domain: {
      match: (fn: string) => {
        return !validator.isNull()(fn);
      },
      value: null,
      required: true
    },
    level: {
      match: (fn: string) => {
        return !validator.isNull()(fn);
      },
      value: null,
      required: true
    },
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
      values.words = JSON.stringify(this.props.keywords);
      values.name = this.props.data.name;
      values.description = this.props.data.description;
      ajax({
        method: "POST",
        url: `${window._BASE}/v1/knowedge/objetives/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data: values,
        beforeSend: () => {
          window.progress.start();
          _button.disabled = true;
        },
        complete: () => {
          window.progress.done();
          _button.disabled = false;
        },
        success: (data: CRUD.objetive) => {
          this.props.next(data);
        },
        error: (data: any) => {
          var state: CRUD.codeError = data.responseJSON;
          var str = sessionStorage.getItem("words-pending");
          var _words: Array<string> = [];
          if (str) {
            _words = JSON.parse(str);
          }
          var config = {
            message: state.message.message,
            timeout: window.settings.alert.delay
          };
          var message: any = document.querySelector('.mdl-js-snackbar')
          message.MaterialSnackbar.showSnackbar(config);
        }
      });
    }
    componentDidUpdate(){
      componentHandler.upgradeAllRegistered();
    }
    componentDidMount(){
      let p1 = ajax({
        method: "GET",
        url: `${window._BASE}/v1/learning/domain/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data: null,
        beforeSend: () => {
          window.progress.start();
        },
        complete: () => {
          window.progress.done();
        }
      });
      p1.done((domains: Array<CRUD.domain>) => {
        this.init = true;
        this.setState({ domains: domains, levels: []});
      });
      componentHandler.upgradeAllRegistered();
    }
    getChange(e: any){
      this.getFields(e);
      var level = this.state.domains.filter((row) => {
        return row._id == this.fields.domain.value;
      });
      if (level.length == 0) {
        this.setState({levels: []})
        return;
      }
      this.setState({levels: level[0].levels})
    }
    render(){
      if (!this.init) {
        return <ModalFree/>;
      }
      return (
        <ModalFree title="Informe de errores">
          <div className="mdl-grid demo-content">
            <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
              <div className="mdl-cell mdl-cell--11-col">
                <h3>Seleccione un dominio y nivel cognitivo</h3>
              </div>
              <div className="mdl-cell mdl-cell--10-col">
                <p>Seleccione el dominio y el nivel correspondiente a la taxonomía bloom más adecuado, nos permitirá ayudar mejor en el proceso de planificación.</p>
              </div>
              <div className="mdl-cell mdl-cell--6-col">
                <div className={"mdl-textfield mdl-textfield " + ((this.state.error.domain) ? 'is-invalid' : '')}>
                  <label className="label static" htmlFor="domain">Dominio de aprendizaje*</label>
                  <select className="mdl-textfield__input" id="domain" onChange={(e: any) => { this.getChange(e) }}>
                    <option value="">Seleccione una opción</option>
                    {this.state.domains.map((row) => {
                      return (
                        <option key={row._id} value={row._id}>{row.name}</option>
                      )
                    })}
                  </select>
                  <span className="mdl-textfield__error">Es necesario un dominio</span>
                </div>
              </div>
              <div className="mdl-cell mdl-cell--6-col">
                <div className={"mdl-textfield mdl-textfield " + ((this.state.error.level) ? 'is-invalid' : '')}>
                  <label className="label static" htmlFor="level">Nivel de aprendizaje*</label>
                  <select className="mdl-textfield__input" id="level" onChange={(e: any) => { this.getFields(e) }}>
                    <option value="">Seleccione una opción</option>
                    {this.state.levels.map((row) => {
                      return (
                        <option key={row._id} value={row._id}>{row.name}</option>
                      )
                    })}
                  </select>
                  <span className="mdl-textfield__error">Es necesario un nivel</span>
                </div>
              </div>
              <div className="mdl-cell mdl-cell--11-col mdl-grid">
                <div className="mdl-cell mdl-cell--9-col"/>
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