import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class Objetive extends React.Component <Card.objetive, {}>{
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window.settings.uri}/v1/knowedge/${this.props.domain}/objetives/${this.props.level}/${this.props.objetive._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: CRUD.objetive)=>{
 	        	this.props.delete(data);
 	        }
 		});
   }
   render(){
     return(
      <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
        <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
          <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
            <h2 className="mdl-card__title-text">{this.props.objetive.name}</h2>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id={`button${this.props.objetive._id}`}>
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor={`button${this.props.objetive._id}`}>
              <li className="mdl-menu__item" onClick={(e) => {this.delete()}}><i className="material-icons">cancel</i> Eliminar</li>
            </ul>
          </div>
          <div className="mdl-card__supporting-text mdl-color-text--grey-600">
            {this.props.objetive._id}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <Link to={`/objetives/get/${this.props.objetive._id}`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver funciones cognitivas</Link>
          </div>
        </div>
      </div>
     );
   }
 }
