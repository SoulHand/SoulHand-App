import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class Grade extends React.Component <Card.grade, {}>{
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window.settings.uri}/v1/grades/${this.props.grade._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: CRUD.grade)=>{
 	        	this.props.delete(data);
 	        }
 		});
   }
   render(){
     return(
      <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
        <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
          <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
            <h2 className="mdl-card__title-text">{this.props.grade.name}</h2>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id={`button${this.props.grade._id}`}>
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor={`button${this.props.grade._id}`}>
              <li className="mdl-menu__item" onClick={(e) => {this.delete()}}><i className="material-icons">cancel</i> Eliminar</li>
            </ul>
          </div>
          <div className="mdl-card__supporting-text mdl-color-text--grey-600">
            {this.props.grade._id}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <Link to={`/grades/get/${this.props.grade._id}`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver detalles</Link>
          </div>
        </div>
      </div>
     );
   }
 }