import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../../profiles/student'
import {LineChart} from '../../linechart'

@withRouter
 export class Objetives extends React.Component <Props.teacherView, {student: People.student, heights: Array<CRUD.height>, weights: Array<CRUD.weight>}>{
   public session: User.session;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       student: null,
       weights: [],
       heights: []
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((data: People.student) => {
       this.setState({
         student : data
       });
     });
   }
   render(){
     if(!this.state.student){
      return (
        <div className="mdl-grid mdl-color--white demo-content">
           <div className="mdl-spinner mdl-js-spinner is-active"></div>
        </div>
      );
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to={`/students/get/${this.props.routeParams.id}`}><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
              <table className="mdl-data-table mdl-js-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric">Objetivo</th>
                    <th>Dominio</th>
                    <th>Nivel</th>
                    <th>Progreso</th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.student.objetives.map((row) => {
                    return (
                      <tr key={row._id}>
                        <td className="mdl-data-table__cell--non-numeric"><span>{row.objetive.name}</span></td>
                        <td className="mdl-data-table__cell">{row.objetive.domain.name}</td>
                        <td className="mdl-data-table__cell">{row.objetive.level.name}</td>
                        <td className="mdl-data-table__cell">{row.completed}</td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
          </main>
       </div>
     );
   }
 }


/*
<div className="mdl-layout-spacer"></div>
{this.state.student && (
  <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
    <i className="material-icons">more_vert</i>
  </button>
)}
<ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
  <li className="mdl-menu__item"><Link to={`/students/get/${this.props.routeParams.id}`}>Eliminar</Link></li>
</ul>

*/
