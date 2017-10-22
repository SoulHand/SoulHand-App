import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as Add from './create'
import {ModalFree, App} from '../../app'


@withRouter
export class Physic extends React.Component<Props.teacherView, {}>{
  public session: User.session;
  public init: boolean = false;
  public physics: Array<CRUD.physic> = [];
  state: { physics: Array<CRUD.physic>, student: People.student} = {
    physics: [],
    student: null
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
      url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
      dataType: "json",
      data:null,
      beforeSend: () => {
        window.progress.start();
      },
      complete: () => {
        window.progress.done();
      }
    });
    p1.done((student: People.student) => {
      this.init = true;
      this.setState({
        physics:student.physics,
        student: student
      });
    });
  }
  render(){
    if(!this.init){
      return (
        <ModalFree title="Desarrollo físico"/>
      );
    }
    return(
        <ModalFree title={`Desarrollo físico ${this.state.student.data.name}`}>
          <ul className="demo-list-three mdl-list">
            {
              this.state.physics.map((row) => {
                return (
                  <li className="mdl-list__item mdl-list__item--three-line" key={row._id}>
                    <span className="mdl-list__item-primary-content">
                      <i className="material-icons mdl-list__item-avatar" title="Palabra">chat</i>
                      <span>{row.age} años {new Date(row.date).toLocaleString()}</span>
                      <span className="mdl-list__item-text-body">
                        <div className="mdl-grid">
                            <div className="mdl-cell mdl-cell--3-col">
                                peso: {row.weight} kg / altura: {row.height} cm
                            </div>
                            <div className="mdl-cell mdl-cell--3-col">
                                IMC: {row.imc}
                            </div>
                        </div>
                      </span>
                    </span>
                  </li>
                );
              })
            }
          </ul>
        </ModalFree>
    );
  }
}

export let Create = Add.Create;