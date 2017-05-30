import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class Teacher extends React.Component <{teacher: People.teacher}, {}>{
   render(){
     return(
      <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
        <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
          <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
            <h2 className="mdl-card__title-text">{this.props.teacher.data.name}</h2>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id={`button${this.props.teacher._id}`}>
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor={`button${this.props.teacher._id}`}>
              <li className="mdl-menu__item"><i className="material-icons">cancel</i> Eliminar</li>
            </ul>
          </div>
          <div className="mdl-card__supporting-text mdl-color-text--grey-600">
            {this.props.teacher.data.dni}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <Link to={`/teachers/get/${this.props.teacher._id}`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver detalles</Link>
          </div>
        </div>
      </div>
     );
   }
 }
