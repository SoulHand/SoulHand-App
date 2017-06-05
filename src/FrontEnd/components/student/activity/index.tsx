import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {CompleteObjetive} from './completeobjetive'
import {Objetives} from './objetives'
import {LineChart} from '../../linechart'

@withRouter
 export class View extends React.Component <Props.GenericRouter, {student: People.student, activity: CRUD.activity}>{
   public session: User.session;
   constructor(props:Props.GenericRouter){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       student: null,
       activity: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   redirect(id: string){
    this.props.router.replace(`/activity/get/${this.props.routeParams.activity}/student/${this.props.routeParams.student}/complete/${id}`);
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/activities/${this.props.routeParams.activity}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((data: CRUD.activity) => {
       let student: People.student = data.students.filter((row) => {
         if(row._id == this.props.routeParams.student){
           return true;
         }
         return false;
       })[0];
       this.setState({
         student: student,
         activity: data
       })
     });
     componentHandler.upgradeAllRegistered();
   }
   render(){
     if(!this.state.student){
       return (
         <div className="mdl-grid mdl-color--white demo-content">
            <div className="mdl-spinner mdl-js-spinner is-active"></div>
         </div>
       );
     }
     let count = {
       completed: 0,
       failed: 0,
       pending: 0,
       count: 0
     };
     this.state.student.activities.forEach((row) => {
       if(row.activity == this.state.activity._id){
         if(row.isAdd == true){
           count.completed ++;
         }else{
           count.failed++;
         }
         count.count ++;
       }
     });
     console.log(count);
     count.pending = this.state.activity.objetives.length - count.count;
     var graficConfig = {
        chart: {
            type: 'pie'
        },
        title:{
          //align: "center",
          //verticalAlign: "center",
          text: ((count.completed*100)/this.state.activity.objetives.length) + "%",
          x: 6,
          y: 230,
          style:{
            fontFamily: "Roboto",
            fontSize: "4em",
            fontWeight: "bold",
            color: "#888"
          }
        },
        plotOptions: {
            pie: {
                //borderColor: '#000000',
                innerSize: '60%'
            }
        },
        series: [{
            data: [
                ['Objetivos completados', count.completed],
                ['Objetivos pendientes', count.pending],
                ['Objetivos fallidos', count.failed]
            ]
        }]
    };
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to={`/activity/get/${this.props.routeParams.activity}`}><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
              <i className="material-icons">more_vert</i>
           </button>
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
           </ul>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            <div className="mdl-grid mdl-color--white demo-content">
            <div className="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
              <LineChart id="container" config={graficConfig}/>
            </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Nombre de la actividad</label>
                    <div className="mdl-textfield__input">
                      {this.state.activity.name}
                    </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Descripción de la actividad</label>
                    <div className="mdl-textfield__input">
                      {this.state.activity.description}
                    </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                    <label className="mdl-input__expandable-holder">Nombre del alumno</label>
                    <div className="mdl-textfield__input">
                      {this.state.student.data.name}
                    </div>
                </div>
              </div>
            </div>
              <label className="label static">Objetivos de aprendizaje esperados</label>
              <table className="mdl-data-table mdl-js-data-table mdl-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric">Objetivo</th>
                    <th>Dominio</th>
                    <th>Nivel</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.activity.objetives.map((row) => {
                    var error:any = "null";
                    var content = (
                      <div className="mdl-cell--1">
                        <div id={`toolp${row._id}`} className="icon material-icons" onClick={this.redirect.bind(this, [row._id])}>delete</div>
                        <div className="mdl-tooltip" data-mdl-for={`toolp${row._id}`}>
                          El objetivo esta pendiente
                        </div>
                      </div>
                    );
                    let obj = this.state.student.activities.filter((row2) => {
                      if(row2.objetive == row._id && row2.activity == this.state.activity._id){
                        return true;
                      }
                      return false;
                    });
                    if(obj.length > 0) {
                      if(obj[0].isAdd == true){
                        error = false;
                        content = (
                          <div className="mdl-cell--1">
                            <div id={`toolp${row._id}`} className="icon material-icons">check</div>
                            <div className="mdl-tooltip" data-mdl-for={`toolp${row._id}`}>
                              Objetivo completado
                            </div>
                          </div>
                        );
                      }else{
                        error = true;
                        content = (
                          <div className="mdl-cell--1">
                            <div id={`toolp${row._id}`} className="icon material-icons">cancel</div>
                            <div className="mdl-tooltip" data-mdl-for={`toolp${row._id}`}>
                              Fallo el objetivo
                            </div>
                          </div>
                        );
                      }
                    }
                    return (
                      <tr key={row._id} id={row._id} style={(error === true) ? {color: "#d50000"} : ((error === false) ? {color: "rgb(41, 162, 63)"} : {})}>
                        <td className="mdl-data-table__cell--non-numeric" title={row.name}><span>{row.name}</span></td>
                        <td title={row.domain.name}><span>{row.domain.name}</span></td>
                        <td title={row.level.name}><span>{row.level.name}</span></td>
                        <td>{content}</td>
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

export let Completed = CompleteObjetive;
export let ViewObjetive = Objetives;
/*
{this.state.student && (
  <table className="mdl-data-table mdl-js-data-table resize">
    <thead>
      <tr>
        <th className="mdl-data-table__cell--non-numeric">Fecha</th>
        <th className="mdl-data-table__cell--non-numeric">Registro</th>
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
)}
*/
