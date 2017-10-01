import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/student'
import { ProgressBar } from '../progressbar'
import { LineChart } from "../linechart"

@withRouter
export class View extends React.Component<Props.teacherView, { student: People.student, report: any, graphs:any, weights: any, heights: any}>{
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
   showKnowEdge(e: any){
     e.preventDefault();
     var modal: any = document.getElementById("knowedge");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.showModal();
   }
   hidenKnowEdge(e: any){
     e.preventDefault();
     var modal: any = document.getElementById("knowedge");
     if (!modal.showModal) {
       window.dialogPolyfill.registerDialog(modal);
     }
     modal.close();
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: People.student)=>{
            this.props.router.replace('/students');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
      }), p2 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/reports/students/objetive/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
      }), p3 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/physic/static/height/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
      }), p4 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/physic/static/weight/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done(), p3.done(), p4.done()]).then((rows: any) => {
       this.init = true;
       var graphs = [{
         name: rows[0].data.name,
         data: rows[0].activities.map((row: CRUD.ActivityMaked): Array<any> => {
           var time = new Date(row.dateCreated);
           return [time.getTime(), ((row.isAdd == true) ? 1 : 0 * Math.random() * 100)];
         })
       }];
       var graphs = [{
         name: rows[0].data.name,
         data: rows[0].activities.map((row: CRUD.ActivityMaked): Array<any> => {
           var time = new Date(row.dateCreated);
           return [time.getTime(), ((row.isAdd == true) ? 1 : 0 * Math.random() * 100)];
         })
       }];
       var graphs2 = [
          {
            name: "Altura actual",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var time = new Date(row.date);
              var sec = time.getTime();
              return [sec, row.height];
            })
          },
          {
            name: "Altura Máxima",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var filter: Array<CRUD.height> = rows[2].filter((height: CRUD.height) => {
                return Math.abs( row.age - height.age) <= 5;
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(filter.length == 0){
                return [sec, null];
              }
              return [sec, filter[0].max];
            })
          },
          {
            name: "Altura Minima",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var filter: Array<CRUD.height> = rows[2].filter((height: CRUD.height) => {
                return Math.abs( row.age - height.age) <= 5;
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(filter.length == 0){
                return [sec, null];
              }
              return [sec, filter[0].min];
            })
          }
        ];
       var graphs3 = [
          {
            name: "Peso actual",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var time = new Date(row.date);
              var sec = time.getTime();
              return [sec, row.weight];
            })
          },
          {
            name: "Peso Máximo",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var filter: Array<CRUD.weight> = rows[2].filter((height: CRUD.weight) => {
                return Math.abs( row.height - height.height) <= 5;
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(filter.length == 0){
                return [sec, null];
              }
              return [sec, filter[0].max];
            })
          },
          {
            name: "Altura Minima",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var filter: Array<CRUD.weight> = rows[2].filter((height: CRUD.weight) => {
                return Math.abs(row.height - height.height) <= 5;
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(filter.length == 0){
                return [sec, null];
              }
              return [sec, filter[0].min];
            })
          }
        ];
        this.setState({
          student: rows[0],
          report: rows[1],
          graphs: [graphs, graphs2, graphs3],
          weights: rows[3],
          heights: rows[2]
        });
     });
   }
   render(){
     if(!this.init){
        return null;
     }
     var chart1 = {
       credits: false,
       chart: {
         type: 'spline'
       },
       title: {
         text: "Progreso academico",
         x: -20,
         style: {
           fontFamily: "Roboto",
           fontWeight: "bold",
           color: "#888"
         }
       },
       xAxis: {
         type: 'datetime',
         dateTimeLabelFormats: { // don't display the dummy year
           month: '%e. %b',
           year: '%b'
         },
         title: {
           text: 'Fecha de registro'
         }
       },
       yAxis: {
         title: {
           text: 'Puntos de experiencia'
         },
         min: 0
       },
       tooltip: {
         headerFormat: '<b>{series.name}</b><br>',
         pointFormat: '{point.x:%e. %b}: {point.y:.2f} XP'
       },
       plotOptions: {
         spline: {
           marker: {
             enabled: true
           }
         }
       },
       series: this.state.graphs[0]
     }, chart2 = {
       credits: false,
       chart: {
         type: 'spline'
       },
       title: {
         text: "Desarrollo físico (altura)",
         x: -20,
         style: {
           fontFamily: "Roboto",
           fontWeight: "bold",
           color: "#888"
         }
       },
       xAxis: {
         type: 'datetime',
         dateTimeLabelFormats: { // don't display the dummy year
           month: '%e. %b',
           year: '%b'
         },
         title: {
           text: 'Fecha de registro'
         }
       },
       yAxis: {
         title: {
           text: 'Altura (cm)'
         },
         min: 0
       },
       tooltip: {
         headerFormat: '<b>{series.name}</b><br>',
         pointFormat: '{point.x:%e. %b}: {point.y:.2f} cm'
       },
       plotOptions: {
         spline: {
           marker: {
             enabled: true
           }
         }
       },
       series: this.state.graphs[1]
       }, chart3 = {
         credits: false,
         chart: {
           type: 'spline'
         },
         title: {
           text: "Desarrollo físico (peso)",
           x: -20,
           style: {
             fontFamily: "Roboto",
             fontWeight: "bold",
             color: "#888"
           }
         },
         xAxis: {
           type: 'datetime',
           dateTimeLabelFormats: { // don't display the dummy year
             month: '%e. %b',
             year: '%b'
           },
           title: {
             text: 'Fecha de registro'
           }
         },
         yAxis: {
           title: {
             text: 'Peso (kg)'
           },
           min: 0
         },
         tooltip: {
           headerFormat: '<b>{series.name}</b><br>',
           pointFormat: '{point.x:%e. %b}: {point.y:.2f} cm'
         },
         plotOptions: {
           spline: {
             marker: {
               enabled: true
             }
           }
         },
         series: this.state.graphs[2]
       };
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/parents"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           {this.state.student && (
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
               <i className="material-icons">more_vert</i>
             </button>
           )}
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
             <li className="mdl-menu__item"><Link to={`/students/edit/${this.props.routeParams.id}`}>Editar</Link></li>
             <li className="mdl-menu__item"><Link to={`/students/get/${this.props.routeParams.id}/physic`}>Desarrollo físico</Link></li>
             <li className="mdl-menu__item"><Link to={`/students/get/${this.props.routeParams.id}/objetives`}>Conocimientos previos</Link></li>
             <li className="mdl-menu__item" onClick={(e)=>{this.delete()}}>Eliminar</li>
           </ul>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            <div className="mdl-grid demo-content">
              <div className="mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
                <List.Student student={this.state.student} />
              </div>
              <div className="demo-graphs mdl-shadow--2dp mdl-color--white mdl-cell mdl-cell--8-col">
                <LineChart id="HistoryActities" config={chart1} />
                <LineChart id="HeightHistory" config={chart2} />
                <LineChart id="WeightHistory" config={chart3} />
              </div>
              <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
                <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
                  <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
                   <h2 className="mdl-card__title-text mdl-typography--text-center">Puntos de experiencia</h2>
                  </div>
                  <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                   <h1 className="mdl-typography--text-center display-2">{this.state.report.exp} XP</h1>
                </div>
                  <div className="mdl-card__actions mdl-card--border">
                   <Link to={`/students/get/${this.props.routeParams.id}/objetives`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver detalles</Link>
                  </div>
                </div>
                <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
                  <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
                   <h2 className="mdl-card__title-text mdl-typography--text-center">Desarrollo físico</h2>
                  </div>
                  <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                    <div className="mdl-grid">
                      <div className="mdl-cell mdl-cell--6-col">
                        <p className="mdl-typography--text-center display-2">Altura</p>
                        <p className="mdl-typography--text-center display-2">{this.state.report.physic.height} cm</p>
                      </div>
                      <div className="mdl-cell mdl-cell--6-col">
                        <p className="mdl-typography--text-center display-2">Peso</p>
                        <p className="mdl-typography--text-center display-2">{this.state.report.physic.weight} kg</p>
                      </div>
                    </div>
                    <p className="mdl-typography--text-center">Registrado: {new Date(this.state.report.physic.date).toLocaleString()}</p>
                  </div>
                  <br/>
                  <div className="mdl-card__actions mdl-card--border">
                    <a href="#" className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver detalles</a>
                  </div>
                </div>
              </div>
              <div className="demo-graphs mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--8-col mdl-grid">
                <h3 className="mdl-typography--text-center">Historial de eventos</h3>
                <table className="mdl-data-table mdl-js-data-table resize">
                  <thead>
                    <tr>
                    <th className="mdl-data-table__cell--non-numeric td-ms-20">Fecha</th>
                    <th className="mdl-data-table__cell--non-numeric td-ms-60">Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.student.history.map((row) => {
                        let date = new Date(row.dateCreated);
                        return (
                          <tr key={row._id}>
                            <td className="mdl-data-table__cell--non-numeric"><span>{date.toLocaleString()}</span></td>
                            <td className="mdl-data-table__cell--non-numeric" title={row.description}><span>{row.description}</span></td>
                          </tr>
                        );
                      })
                    }
                  </tbody>
                </table>
              </div>
              <dialog className="mdl-dialog" id="knowedge" key="knowedge">
               <div className="mdl-dialog__content mdl-dialog__actions--full-width">
                 <h3 className="mdl-typography--text-center">Conocimientos previos</h3>
                 <table className="mdl-data-table mdl-js-data-table resize">
                   <thead>
                     <tr>
                       <th className="mdl-data-table__cell--non-numeric td-ms-40">Objetivo</th>
                       <th className="mdl-data-table__cell--non-numeric td-ms-20">Dominio</th>
                       <th className="mdl-data-table__cell td-ms-15">Nivel</th>
                       <th className="mdl-data-table__cell--non-numeric td-ms-25">Progreso</th>
                     </tr>
                   </thead>
                   <tbody>
                     {
                       this.state.report.objetives.map((row: any) => {
                         return (
                           <tr key={"tr-" + row._id}>
                             <td className="mdl-data-table__cell--non-numeric"><span>{row.objetive.name}</span></td>
                             <td className="mdl-data-table__cell--non-numeric">{row.objetive.domain.name}</td>
                             <td className="mdl-data-table__cell">{row.objetive.level.level}</td>
                             <td className="mdl-data-table__cell--non-numeric">
                               <ProgressBar title={`${row.exp} XP`} width={row.avg} />
                             </td>
                           </tr>
                         );
                       })
                     }
                   </tbody>
                 </table>
                </div>
                <div className="mdl-dialog__actions">
                 <button type="button" className="mdl-button close" onClick={this.hidenKnowEdge.bind(this)}>Cerrar</button>
                </div>
              </dialog>
          </div>
        </main>
       </div>
     );
   }
 }
