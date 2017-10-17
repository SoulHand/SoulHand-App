import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../profiles/student'
import { App, ModalFree } from '../app'
import { HeaderFree } from '../app/header'
import { ProgressBar } from '../progressbar'
import { LineChart } from "../linechart"

@withRouter
export class View extends React.Component<Props.teacherView, any>{
   public session: User.session;
   public init: boolean = false;
   public state: { student: People.student, report: any, graphs:any, weights: any, heights: any} = {
      student: null,
      report: [],
      graphs: [],
      weights: [],
      heights: []
   }
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
          beforeSend: () => {
            window.progress.start();
          },
          complete: () => {
            window.progress.done();
          },
 	        success:(data: People.student)=>{
            this.props.router.replace('/students');
 	        }
 		});
   }
   componentDidMount(){
      window.progress.start();
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
       window.progress.done();
       var graphs = [{
         name: rows[0].data.name,
         data: rows[0].activities.map((row: CRUD.ActivityMaked): Array<any> => {
           var time = new Date(row.dateCreated);
           return [time.getTime(), row.exp];
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
              var _min: Number, _height: CRUD.height;
              rows[2].forEach((height: CRUD.height) => {
                var _dist = Math.abs(row.age - height.age);
                if(rows[0].data.genero == height.genero){
                  if(_min == null || _min > _dist){
                    _min = _dist;
                    _height = height;
                  }
                }
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(!_height){
                return [sec, null];
              }
              return [sec, _height.max];
            })
          },
          {
            name: "Altura Minima",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var _min: Number, _height: CRUD.height;
              rows[2].forEach((height: CRUD.height) => {
                var _dist = Math.abs(row.age - height.age);
                if(rows[0].data.genero == height.genero){
                  if(_min == null || _min > _dist){
                    _min = _dist;
                    _height = height;
                  }
                }
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(!_height){
                return [sec, null];
              }
              return [sec, _height.min];
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
              var _min: Number, _weight: CRUD.weight;
              rows[3].forEach((weight: CRUD.weight) => {
                var _dist = Math.abs(row.age - weight.age);
                if(rows[0].data.genero == weight.genero){
                  if(_min == null || _min > _dist){
                    _min = _dist;
                    _weight = weight;
                  }
                }
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(!_weight){
                return [sec, null];
              }
              return [sec, _weight.max];
            })
          },
          {
            name: "Peso Minimo",
            data: rows[0].physics.map((row: CRUD.physic) => {
              var _min: Number, _weight: CRUD.weight;
              rows[3].forEach((weight: CRUD.weight) => {
                var _dist = Math.abs(row.age - weight.age);
                if(rows[0].data.genero == weight.genero){
                  if(_min == null || _min > _dist){
                    _min = _dist;
                    _weight = weight;
                  }
                }
              });
              var time = new Date(row.date);
              var sec = time.getTime();
              if(!_weight){
                return [sec, null];
              }
              return [sec, _weight.min];
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
     if (!this.init) {
       return (
         <ModalFree />
       );
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
           pointFormat: '{point.x:%e. %b}: {point.y:.2f} kg'
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
     return (
       <div className= "mdl-layout mdl-layout--fixed-header">
         <HeaderFree title={this.state.student.data.name} menu={
           [
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn" key="BUTTON1">
               <i className="material-icons">more_vert</i>
             </button>
             ,
             <ul className="mdl-menu mdl-js-menu mdl-js-ripple effect mdl-menu--bottom-right" htmlFor="hdrbtn" key="hdrbtn12">
               <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.push(`/students/edit/${this.props.routeParams.id}`);
               }
               }>Editar</li>
               <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.push(`/students/get/${this.props.routeParams.id}/objetives`);
               }
               }>Conocimientos previos</li>
             </ul>
           ]
         }/>
         <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
         <div className="demo-ribbon mdl-color--teal-400" />
         <main className="demo-main mdl-layout__content">
           <div className="demo-container mdl-grid">
             <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col">
               <List.Student student={this.state.student} />
             </div>
           </div>
           <div className="mdl-grid demo-content">
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
                   <h1 className="mdl-typography--text-center display-2">{this.state.student.exp} XP</h1>
                 </div>
                 <div className="mdl-card__actions mdl-card--border">
                   <Link to={`/students/get/${this.props.routeParams.id}/objetives`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver detalles</Link>
                 </div>
               </div>
               {this.state.report.physic && (
                 <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
                   <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
                     <h2 className="mdl-card__title-text mdl-typography--text-center">Desarrollo físico</h2>
                   </div>
                   <div className="mdl-card__supporting-text mdl-color-text--grey-600">
                     <div className="mdl-grid">
                       <div className="mdl-cell mdl-cell--4-col">
                         <p className="mdl-typography--text-center display-2">Altura</p>
                         <p className="mdl-typography--text-center display-2">{this.state.report.physic.height} cm</p>
                       </div>
                       <div className="mdl-cell mdl-cell--4-col">
                         <p className="mdl-typography--text-center display-2">Peso</p>
                         <p className="mdl-typography--text-center display-2">{this.state.report.physic.weight} kg</p>
                       </div>
                       <div className="mdl-cell mdl-cell--4-col">
                         <p className="mdl-typography--text-center display-2">IMC</p>
                         <p className="mdl-typography--text-center display-2">{this.state.report.physic.imc.toFixed(2)}</p>
                       </div>
                     </div>
                     <p className="mdl-typography--text-center">Registrado: {new Date(this.state.report.physic.date).toLocaleString()}</p>
                   </div>
                   <br />
                   <div className="mdl-card__actions mdl-card--border">
                     <a href="#" className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver detalles</a>
                   </div>
                 </div>
               )}
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
           <div className="fixed">
             <button id="add-menu" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></button>
             <ul className="mdl-menu mdl-menu--top-right mdl-js-menu mdl-js-ripple-effect"
               data-mdl-for="add-menu">
               <li className="mdl-menu__item" onClick={(e) => {
                 this.props.router.replace(`/students/get/${this.props.routeParams.id}/physic/create`);
               }}>
                 <i className="material-icons">assignment</i> Añadir un desarrollo físico
                  </li>
             </ul>
           </div>
         </main>   
       </div>
     );
   }
 }
