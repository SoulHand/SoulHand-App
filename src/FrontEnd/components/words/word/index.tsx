import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {ParentCreate} from './parentcreate'
import {AlumnCreate} from './alumncreate'
import * as Objetive from '../../objetive/parentcreate'
import {View} from './view'
import {ModalTabSearch, App} from '../../app'


@withRouter
export class Word extends React.Component<Props.teacherView, {}>{
  public session: User.session;
  public init: boolean = false;
  public words: Array<Words.word> = [];
  public lexems: Array<Words.Lexema> = [];
  public terms: Array<Words.Term> = [];
  public deleteMode = {
    type: "",
    id: ""
  };
  state: { words: Array<Words.word>, lexems: Array<Words.Lexema>, terms: Array<Words.Term>} = {
    words: [],
    lexems: [],
    terms: []
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
      url: `${window._BASE}/v1/words/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
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
      }
    }), p3 = ajax({
        method: "GET",
        url: `${window._BASE}/v1/terms/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
        dataType: "json",
        data: null,
        beforeSend: () => {
          window.progress.start();
        },
        complete: () => {
          window.progress.done();
        }
      });
    window.Promise.all([p1.done(), p2.done(), p3.done()]).then((datas: any) => {
      this.words = datas[0];
      this.lexems = datas[1];
      this.terms = datas[2];
      this.init = true;
      this.setState({
        words: this.words,
        lexems: this.lexems,
        terms: this.terms
      });
    });
  }
  delete(id: string){
    let p1 = ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/words/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done(() => {
      this.words = this.words.filter((row) => {
        if (row._id === id) {
          return false;
        }
        return true;
      });
      this.setState({ words: this.words});
    });
  }
  delete2(id: string){
    let p1 = ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/words/lexemas/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done(() => {
      this.lexems = this.lexems.filter((row) => {
        if (row._id === id) {
          return false;
        }
        return true;
      });
      this.setState({ lexems: this.lexems});
    });
  }
  delete3(id: string){
    let p1 = ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/terms/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done(() => {
      this.terms = this.terms.filter((row) => {
        if (row._id === id) {
          return false;
        }
        return true;
      });
      this.setState({ lexems: this.lexems});
    });
  }
  Filter(event:any){
   		var filter = this.words.filter((row)=>{
   			var exp = new RegExp(event.target.value,"i");
          return exp.test(row.key);
   		});
   		var filter2 = this.lexems.filter((row)=>{
         var exp = new RegExp(event.target.value,"i");
          var isValid = false;
          for(var i = 0, n = row.morphems.length; i<n; i++){
            if (exp.test(row.morphems[i].key)){
              isValid = true;
              break;
            }
          }
          return exp.test(row.key) || isValid;
   		});
   		var filter3 = this.terms.filter((row)=>{
         var exp = new RegExp(event.target.value,"i");
          var isValid = false;
          for(var i = 0, n = row.hiponimos.length; i<n; i++){
            if (exp.test(row.hiponimos[i].key)){
              isValid = true;
              break;
            }
          }
          return exp.test(row.concept) || isValid;
   		});
   		this.setState({
           words : filter,
           lexems: filter2,
           terms: filter3
 	    });
     }
  deleteVal(){
    switch (this.deleteMode.type){
      case "word":
        this.delete(this.deleteMode.id);
      break;
      case "lexema":
        this.delete2(this.deleteMode.id);
      break;
      case "term":
        this.delete3(this.deleteMode.id);
      break;
    }
    this.hiden();
  }
  show(id: string, type: string) {
    var modal: any = document.getElementById("modal-delete");
    this.deleteMode.type = type;
    this.deleteMode.id = id;
    if (!modal.showModal) {
      window.dialogPolyfill.registerDialog(modal);
    }
    modal.showModal();
  }
  hiden() {
    var modal: any = document.getElementById("modal-delete");
    if (!modal.showModal) {
      window.dialogPolyfill.registerDialog(modal);
    }
    this.deleteMode.type = "";
    this.deleteMode.id = "";
    modal.close();
  }
  render(){
    if(!this.init){
      return (
        <App title="Palabras"/>
      );
    }
    return(
      <ModalTabSearch filter={this.Filter.bind(this)} title="Palabras"
        menu = {[
          <a key="words" href="#words" className="mdl-layout__tab is-active">Palabras</a>,
          <a key="lexems" href="#lexems" className="mdl-layout__tab">Lexemas</a>,
          <a key="concepts" href="#terms" className="mdl-layout__tab">Inf. semantica</a>
        ]}>
        <section className="mdl-layout__tab-panel is-active" id="words">
          <ul className="demo-list-three mdl-list">
            {
              this.state.words.map((row) => {
                var tags = row.concepts.map((concept) => {
                  return (
                    <span className="mdl-chip" key={concept._id}>
                      <span className="mdl-chip__text" title={concept.key}>{concept.value}</span>
                    </span>
                  );
                });
                return (
                  <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                    <span className="mdl-list__item-primary-content">
                      <i className="material-icons mdl-list__item-avatar" title="Palabra">chat</i>
                      <span>{row.key}</span>
                      <span className="mdl-list__item-text-body">
                        {tags}
                      </span>
                    </span>
                    <span className="mdl-list__item-secondary-content">
                      <div className="mdl-grip">
                        <div onClick={(e) => {
                          this.props.router.push(`words/words/get/${row._id}`);
                        }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                        <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                          Ver
                        </div>
                        <div onClick={this.show.bind(this, row._id, "word")} id={`delete${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>delete</div>
                        <div className="mdl-tooltip" data-mdl-for={`delete${row._id}`}>
                          Eliminar
                        </div>
                      </div>
                    </span>
                  </li>
                );
              })
            }
          </ul>
        </section>
        <section className="mdl-layout__tab-panel" id="lexems">
          <ul className="demo-list-three mdl-list">
            {
              this.state.lexems.map((row) => {
                return (
                  <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                    <span className="mdl-list__item-primary-content">
                      <i className="material-icons mdl-list__item-avatar" title="Lexema">chat_bubble_outline</i>
                      <span>{row.key}</span>
                      <span className="mdl-list__item-text-body">
                        {row.morphems.length} Morfemas
                      </span>
                    </span>
                    <span className="mdl-list__item-secondary-content">
                      <div className="mdl-grip">
                        <div onClick={(e) => {
                          this.props.router.push(`words/get/${row._id}`);
                        }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                        <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                          Ver
                        </div>
                        <div onClick={this.show.bind(this, row._id, "lexema")} id={`delete${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>delete</div>
                        <div className="mdl-tooltip" data-mdl-for={`delete${row._id}`}>
                          Eliminar
                        </div>
                      </div>
                    </span>
                  </li>
                );
              })
            }
          </ul>
        </section>
        <section className="mdl-layout__tab-panel" id="terms">
          <ul className="demo-list-three mdl-list">
            {
              this.state.terms.map((row) => {
                return (
                  <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                    <span className="mdl-list__item-primary-content">
                      <i className="material-icons mdl-list__item-avatar"  title="Cat. gramátical">style</i>
                      <span>{row.concept}</span>
                      <span className="mdl-list__item-text-body">
                        {row.hiponimos.length} palabras
                      </span>
                    </span>
                    <span className="mdl-list__item-secondary-content">
                      <div className="mdl-grip">
                        <div onClick={(e) => {
                          this.props.router.push(`/terms/get/${row._id}`);
                        }} id={`view${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>visibility</div>
                        <div className="mdl-tooltip" data-mdl-for={`view${row._id}`}>
                          Ver
                                </div>
                        <div onClick={this.show.bind(this, row._id, "term")} id={`delete${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>delete</div>
                        <div className="mdl-tooltip" data-mdl-for={`delete${row._id}`}>
                          Eliminar
                        </div>
                      </div>
                    </span>
                  </li>
                );
              })
            }
          </ul>
        </section>
        <div className="fixed">
          <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
          <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
            data-mdl-for="add-menu">
            <li className="mdl-menu__item" onClick={(e) => {
              this.props.router.push("/words/words/create");
            }}>
              <i className="material-icons">chat</i> Añadir una palabra
            </li>
            <li className="mdl-menu__item" onClick={(e) => {
              this.props.router.push("/words/create");
            }}>
              <i className="material-icons">chat</i> Añadir un lexema
            </li>
            <li className="mdl-menu__item" onClick={(e) => {
              this.props.router.push("/terms/create");
            }}>
              <i className="material-icons">chat</i> Añadir una categoría semantica
            </li>
          </ul>
        </div>
        <dialog className="mdl-dialog" id="modal-delete" key="modal-delete">
            <div className="mdl-dialog__content mdl-dialog__actions--full-width">
              ¿Desea eliminar el siguiente registro?
            </div>
            <div className="mdl-dialog__actions">
              <button type="submit" className="mdl-button open" onClick={this.deleteVal.bind(this)}>De acuerdo</button>
              <button type="button" className="mdl-button close" onClick={this.hiden.bind(this)}>No estoy de acuerdo</button>
            </div>
        </dialog>
      </ModalTabSearch>
    );
  }
}

export let Add = ParentCreate;
export let Get = View;
export let setStudent = AlumnCreate;
