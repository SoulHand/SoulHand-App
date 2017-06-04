import * as React from 'react'
import {Link, withRouter} from 'react-router'


@withRouter
 export class Activity extends React.Component <{activity: CRUD.activity},{}>{
   render(){
     let create = new Date(this.props.activity.dateCreated);
     let expired = new Date(this.props.activity.dateExpire);
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
     </div>
     );
   }
 }
