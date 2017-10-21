import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {ParentCreate} from './parentcreate'
import {HeightCreate} from './heightcreate'
import {ModalTabSearch, App} from '../app'


@withRouter
export class Physic extends React.Component<Props.teacherView, {}>{
  public session: User.session;
  public init: boolean = false;
  public weights: Array<any> = [];
  public heights: Array<any> = [];
  public deleteMode = {
    type: "",
    id: ""
  };
  state: { weights: Array<any>, heights: Array<any>} = {
    weights: [],
    heights: []
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
      url: `${window._BASE}/v1/physic/static/weight?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
      url: `${window._BASE}/v1/physic/static/height?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data: null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    window.Promise.all([p1.done(), p2.done()]).then((datas: any) => {
      this.weights = datas[0];
      this.heights = datas[1];
      this.init = true;
      this.setState({
        weights: this.weights,
        heights: this.heights
      });
    });
  }
  delete(id: string){
    let p1 = ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/physic/static/weight/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
      this.weights = this.weights.filter((row) => {
        return row._id != id;
      });
      this.setState({ weights: this.weights});
    });
  }
  delete2(id: string){
    let p1 = ajax({
      method: "DELETE",
      url: `${window._BASE}/v1/physic/static/height/${id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
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
      this.heights = this.heights.filter((row) => {
        return row._id != id;
      });
      this.setState({ heights: this.heights});
    });
  }
  Filter(event:any){
    var filter = this.weights.filter((row)=>{
      var exp = new RegExp(event.target.value, "ig");
      return  exp.test(row.age) || exp.test(row.weight);
    });
    var filter2 = this.heights.filter((row)=>{
      var exp = new RegExp(event.target.value, "ig");
      return exp.test(row.age) || exp.test(row.height);
    });
    this.setState({
      weights : filter,
      heights: filter2
    });
  }
  deleteVal(){
    switch (this.deleteMode.type){
      case "weight":
        this.delete(this.deleteMode.id);
      break;
      case "height":
        this.delete2(this.deleteMode.id);
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
        <App title="Desarrollo físico"/>
      );
    }
    return(
      <ModalTabSearch filter={this.Filter.bind(this)} title="Desarrollo físico"
        menu = {[
          <a key="weight" href="#weight" className="mdl-layout__tab is-active">Peso</a>,
          <a key="height" href="#height" className="mdl-layout__tab">Altura</a>,
        ]}>
        <section className="mdl-layout__tab-panel is-active" id="weight">
          <ul className="demo-list-three mdl-list">
            {
              this.state.weights.map((row) => {
                return (
                  <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                    <span className="mdl-list__item-primary-content">
                      <i className="material-icons mdl-list__item-avatar" title="Palabra">chat</i>
                      <span>{row.age} años ({row.genero})</span>
                      <span className="mdl-list__item-text-body">
                        min: {row.min} kg / max: {row.max} kg
                      </span>
                    </span>
                    <span className="mdl-list__item-secondary-content">
                      <div className="mdl-grip">
                        <div onClick={this.show.bind(this, row._id, "weight")} id={`delete${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>delete</div>
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
        <section className="mdl-layout__tab-panel" id="height">
          <ul className="demo-list-three mdl-list">
            {
              this.state.heights.map((row) => {
                return (
                  <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                    <span className="mdl-list__item-primary-content">
                      <i className="material-icons mdl-list__item-avatar" title="Lexema">chat_bubble_outline</i>
                      <span>{row.age} años ({row.genero})</span>
                      <span className="mdl-list__item-text-body">
                        min: {row.min} cm / max: {row.max} cm
                      </span>
                    </span>
                    <span className="mdl-list__item-secondary-content">
                      <div className="mdl-grip">
                        <div onClick={this.show.bind(this, row._id, "height")} id={`delete${row._id}`} className="icon material-icons" style={{ cursor: "pointer" }}>delete</div>
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
              this.props.router.push("/physic/weight/create");
            }}>
              <i className="material-icons">chat</i> Añadir un peso
            </li>
            <li className="mdl-menu__item" onClick={(e) => {
              this.props.router.push("/physic/height/create");
            }}>
              <i className="material-icons">chat</i> Añadir una altura
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
export let Height = HeightCreate;
