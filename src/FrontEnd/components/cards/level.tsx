import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class Level extends React.Component <Card.level, {}>{
   delete() {
     ajax({
       method: "DELETE",
       url: `${window._BASE}/v1/knowedge/${this.props.domain}/level/${this.props.level._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
       dataType: "json",
       data: null,
       crossDomain: true,
       beforeSend: () => {
         window.progress.start();
       },
       complete: () => {
         window.progress.done();
       },
       success: (data: People.student) => {
         this.props.delete(data);
       }
     });
   }
   render(){
     return(
      <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
        <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
          <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
            <h2 className="mdl-card__title-text">{this.props.level.name}</h2>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id={`button${this.props.domain._id}`}>
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor={`button${this.props.domain._id}`}>
              <li className="mdl-menu__item" onClick={(e) => { this.delete() }}><i className="material-icons">cancel</i> Eliminar</li>
            </ul>
          </div>
          <div className="mdl-card__supporting-text mdl-color-text--grey-600">
            {this.props.level._id}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <Link to={`/domains/${this.props.domain}/objetives/${this.props.level._id}`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver Objetivos</Link>
          </div>
        </div>
      </div>
     );
   }
 }
