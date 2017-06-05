import * as React from 'react'
import {Link, withRouter} from 'react-router'


@withRouter
 export class Activity extends React.Component <{activity: CRUD.activity},{}>{
   render(){
     let create = new Date(this.props.activity.dateCreated);
     let expired = new Date(this.props.activity.dateExpire);
     let length = (expired.getTime()-Date.now())/8.64e+7;
     let str = "Completado";
     if(this.props.activity.isCompleted != true) {
       if(length <= 0) {
         str = "expirado"
       }else{
         let day = Math.floor(length);
         if (day > 0) {
           str = day + ((day == 1) ? "día": "días")
         }else{
           let hours = length * 24;
           let minutes = hours * 60;
           let seconds = minutes * 60;
           if(minutes >= 60) {
             minutes = 0
             hours += 1
           }
           if(seconds >= 60) {
             seconds = 0
             minutes += 1
           }
           hours = Math.floor(hours);
           minutes = Math.floor(minutes);
           seconds = Math.floor(seconds);
           str = `falta ${hours} h ${minutes} min y ${seconds} seg`
         }
       }
     }
     return (
       <div className="mdl-grid mdl-color--white demo-content">
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Nombre de la actividad</label>
            <div className="mdl-textfield__input">
              {this.props.activity.name}
            </div>
          </div>
        </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
        <div className="mdl-textfield">
          <label className="mdl-input__expandable-holder">descripción</label>
          <div className="mdl-textfield__input">
            {this.props.activity.description}
          </div>
        </div>
        </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
        <div className="mdl-textfield">
          <label className="mdl-input__expandable-holder">Fecha de creación</label>
          <div className="mdl-textfield__input">
            {create.toLocaleString()}
          </div>
        </div>
       </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Fecha de expiración</label>
            <div className="mdl-textfield__input">
              {expired.toLocaleString()}
            </div>
          </div>
       </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Materia</label>
            <div className="mdl-textfield__input">
              {this.props.activity.course.name}
            </div>
          </div>
       </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Estado</label>
            <div className="mdl-textfield__input">
              {str}
            </div>
          </div>
       </div>
     </div>
     );
   }
 }
