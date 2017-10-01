import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../../profiles/student'
import {LineChart} from '../../linechart'
import {App} from '../../app'
import { ProgressBar} from '../../progressbar'

@withRouter
 export class Objetives extends React.Component <Props.teacherView, any>{
   public session: User.session;
   public init: boolean = false;
   constructor(props:Props.teacherView){
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
       url: `${window._BASE}/v1/reports/students/objetive/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null,
       beforeSend: () => {
         //window.progress.start();
       },
       complete: (e) => {
         //window.progress.done();
       }
     });
     p1.done((data: any) => {
       this.init = true;
       this.setState(data);
     });
   }
   render(){
     if(!this.init){
       return <App/>;
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
            <div className="mdl-grid demo-content">
              <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
                <div className="mdl-cell mdl-cell--3-col mdl-cell--3-col-desktop width-center">
                  <h5 className="mdl-typography--text-center">Puntos de experiencia</h5>
                  <div id="ind1" className="card-circle-ld mdl-color--blue-900">{this.state.exp} XP</div>
                    <div className="mdl-tooltip" data-mdl-for="ind1">
                      La experiencia mide la cantidad de aciertos.
                    </div>
                </div>
                <div className="mdl-cell mdl-cell--3-col mdl-cell--3-col-desktop width-center">
                  <h5 className="mdl-typography--text-center">Promedio de aciertos</h5>
                  <div id="ind2" className="card-circle-ld mdl-color--red-500">{this.state.avg}</div>
                    <div className="mdl-tooltip" data-mdl-for="ind2">
                      Estima la frecuencia de aciertos en el alumno.
                    </div>
                </div>
              </div>
              <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--12-col">
                <h3>Conocimientos previos</h3>
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
                     this.state.objetives.map((row: any) => {
                       return (
                         <tr key={row._id}>
                           <td className="mdl-data-table__cell--non-numeric"><span>{row.objetive.name}</span></td>
                           <td className="mdl-data-table__cell">{row.objetive.domain.name}</td>
                           <td className="mdl-data-table__cell">{row.objetive.level.level}</td>
                           <td className="mdl-data-table__cell">
                             <ProgressBar title={`${row.exp} exp`} width={row.avg} />
                           </td>
                         </tr>
                       );
                     })
                   }
                 </tbody>
               </table>
              </div>
            </div>
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
