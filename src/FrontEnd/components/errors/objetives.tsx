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
  public init: boolean = false;
  public data: any;
  public error: ErrorReport;
  public now: any;
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
    this.data = keywords;
    this.now = this.data.shift();
    this.props.router.replace(`/errors/2/objetives/new`);
  }
  new_word_step2(e: any){
    this.words_query = Object.assign(this.words_query, e);
    this.now = this.data.shift();
    console.log(this.now, this.data, this.words_query);
    if (this.now){
      this.forceUpdate();
      return;
    }
    this.props.router.replace(`/errors/3/objetives/new`);
  }
  new_word_step3(){
    sessionStorage.setItem("word-pending", JSON.stringify(this.data));
    this.now = this.data.shift();
    if(this.now){
      this.props.router.replace(`/errors/2/objetives/new`);
    }else{
      this.props.router.replace(`/errors/5/objetives/new`);      
    }
  }
  componentDidMount(){
    componentHandler.upgradeAllRegistered();
  }
  componentDidUpdate(){
    componentHandler.upgradeAllRegistered();
  }
  finish(){
    sessionStorage.removeItem("word-pending");
    window.history.back();
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
              body = <WordStep3 word={this.now} next={this.new_word_step3.bind(this)} session={this.session} lexema={this.download.word.lexema._id} morphems={this.download.word.morphems.map((row) => {return row._id})}/>
            break;
            case "5":
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
     return questions;
   }
   getQuestion():Question | boolean{
     var _question, val = true;
     if (this.questions.length == 0){
       return false;
     }
     do{
      _question = this.questions.shift();
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
        this.state.question = _problem;
        this.setState(this.state);
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

class Form extends FormUtils<{ word: string, next: Function, session: User.session, lexema?: any, morphems?: Array<string>}, {error: compat.Map, word?: Words.word, concepts?: Array<Words.Term>, isPending?: boolean, lexema?: Words.Lexema, morphem?: Words.Morphema, term?: Words.Term}>{
   public init: boolean = false;
  state: { error: compat.Map, word?: Words.word, concepts?: Array<Words.Term>, isPending?: boolean, lexema?: Words.Lexema, morphem?: Words.Morphema, term?: Words.Term } = {
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
      this.props.next(parseFloat(values.exp));
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


class WordNotLexem extends Form{
  public lexems: Array<Words.Lexema> = [];
  public lexem: Words.Lexema;
  public fields:compat.Map={
      name:{
        value:this.props.word,
        required:true
      }
    };
  public concept: any = {
    key: "",
    value: ""
  };
  loadMorphem(data: Array<Words.Morphema>){
    this.props.next({
      lexema: this.lexem,
      morphems: data
    });
  }
  send(event: any){
    var values: compat.Map = {};
    var error = false;
    var _button = event.target;
    for(let i in this.fields){
      this.state.error[i] = !super.validate(this.fields[i].value, i);
      values[i] = this.fields[i].value;
      error = error || this.state.error[i];
    }
    if (error) {
      this.setState(this.state);
      return;
    }
    for(let i = 0, n = this.lexems.length; i < n; i++){
      if(this.lexems[i].key == values.name.toUpperCase()){
        this.lexem = this.lexems[i];
        return this.setState({ lexema: this.lexems[i]});
      }
    }
    ajax({
        method:"POST",
        url: `${window._BASE}/v1/objetives/lexemas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
        success:(data:Words.Lexema)=>{
          this.lexem = data;
          this.setState({lexema: data});
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
      url: `${window._BASE}/v1/objetives/lexemas?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done((activity: Array<Words.Lexema>) => {
      this.lexems = activity;
      this.init = true;
      this.forceUpdate();
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
    if (this.state.lexema){
      return (
        <WordNotMorphem session={this.session} word={this.props.word} lexema={this.state.lexema} next={this.loadMorphem.bind(this)}/>
      );
    }
    return (
      <ModalFree title="Informe de errores">
        <div className="mdl-grid demo-content">
          <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
            <div className="mdl-cell mdl-cell--11-col">
              <h3>{this.props.word}</h3>
              <p>Escriba el lexema (palabra raíz) correspondiente a la palabra <b>{this.props.word}</b></p>
            </div>
            <div className="mdl-cell mdl-cell--10-col">
              <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.name) ? 'is-invalid' : '')}>
                <input type="text" className="mdl-textfield__input" id="name" onChange={(e: any) => { this.getFields(e) }} />
                <label className="mdl-textfield__label" htmlFor="name">Lexema*</label>
                <span className="mdl-textfield__error">Es necesaria una definición</span>
              </div>
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

class WordNotMorphem extends Form{
  public lexem: string;
  public morphems: Array<string> = [];
  public datas: Array<Words.Morphema> = [];
  public morphem: string;
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
      labels: [],
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
  constructor(props: any){
    super(props);
    this.morphems = props.word.trim().split(props.lexema.key);
    while (!this.morphem){
      this.morphem = this.morphems.shift().trim();
    }
    this.fields.name.value = this.morphem;
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
      url: `${window._BASE}/v1/objetives/lexemas/${this.props.lexema._id}/morphemas/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
      success: (data: Words.Lexema) => {
        for(let i = 0, n = data.morphems.length; i<n; i++){
          if(data.morphems[i].key == values.name.toUpperCase()){
            this.datas.push(data.morphems[i]);
            break;
          }
        }
        if(this.morphem = this.morphems.shift()){
          this.forceUpdate();
          return;
        }
        this.props.next(this.datas);
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
  addKey(e: React.EventHandler<any>): any {
    if (this.concept.key.trim() == "") {
      this.state.error.term = true;
      this.setState({ error: this.state.error });
      return null;
    }
    this.fields.concepts.value.push({
      key: this.concept.key,
      value: this.concept.value
    });
    this.fields.concepts.labels.push(this.concept.value);
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
    this.fields.concepts.value.splice(id, 1);
    this.fields.concepts.labels.splice(id, 1);
    this.forceUpdate();
  }
  getConcept1(e: any){
    this.concept.key = e.target.value;
    this.state.error.words = false;
    this.setState({ error: this.state.error });
  }
  getConcept2(e: any){
    this.concept.value = e.target.value;
    this.state.error.words = false;
    this.setState({ error: this.state.error });
  }
  loadMorphem(data: Words.Morphema) {
    //this.morphems.push(data);
  }
  render(){
    var keys = null;
    switch (this.concept.key) {
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
      <ModalFree title="Informe de errores">
        <div className="mdl-grid demo-content">
          <div className="mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--9-col mdl-grid">
            <div className="mdl-cell mdl-cell--11-col">
              <h3>{this.morphem}</h3>
              <p>Seleccione las funciones gramaticales correspondientes a la palabra <b>{this.props.word}</b></p>
            </div>
            <div className="mdl-cell--12-col mdl-cell--middle">
              <p><b>Morfema:</b> {this.morphem}</p>
            </div>
            <div className="mdl-cell--12-col mdl-cell--middle">
              <div className="mdl-grid">
                <div className="mdl-cell--5-col mdl-cell--middle" style={{ marginRight: "5px" }}>
                  <div className={"mdl-textfield mdl-textfield " + ((this.state.error.key || this.state.error.concepts) ? 'is-invalid' : '')}>
                    <label className="label static" htmlFor="key">Tipo de concepto</label>
                    <select className="mdl-textfield__input" id="key" onChange={this.getConcept1.bind(this)} value={this.concept.key}>
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
                    <select className="mdl-textfield__input" id="value" onChange={this.getConcept2.bind(this)} value={this.concept.value}>
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
            <div className="mdl-cell--11-col mdl-cell--middle">
              {this.fields.concepts.value.map((row: any, index: number) => {
                return (
                  <span className="mdl-chip" key={index}>
                    <span className="mdl-chip__text">{this.fields.concepts.labels[index]}</span>
                    <button type="button" className="mdl-chip__action" onClick={this.deleteItem.bind(this, index)}><i className="material-icons">cancel</i></button>
                  </span>
                );
              })}
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