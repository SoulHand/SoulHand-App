import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class Activity extends React.Component <Card.activity, {}>{
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window.settings.uri}/v1/activities/${this.props.activity._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: CRUD.activity)=>{
 	        	this.props.delete(data);
 	        }
 		});
   }
   render(){
     let expire = new Date(this.props.activity.dateExpire);
     let length = (expire.getTime()-Date.now())/8.64e+7;
     let str = "Completado";
     if(this.props.activity.isCompleted != true) {
       if(length <= 0) {
         str = "expirado"
       }else{
         console.log(length, expire)
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
     console.log(this.props.activity.dateExpire);
     return(
      <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
        <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
          <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
            <h2 className="mdl-card__title-text">{this.props.activity.name}</h2>
            <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id={`button${this.props.activity._id}`}>
              <i className="material-icons">more_vert</i>
            </button>
            <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor={`button${this.props.activity._id}`}>
              <li className="mdl-menu__item" onClick={(e) => {this.delete()}}><i className="material-icons">cancel</i> Eliminar</li>
            </ul>
          </div>
          <div className="mdl-card__supporting-text mdl-color-text--grey-600">
            <div className="mdl-grid">
              <div className="mdl-cell--1">
                <div id={`toolp${this.props.activity._id}`} className="icon material-icons">event_note</div>
                <div className="mdl-tooltip" data-mdl-for={`toolp${this.props.activity._id}`}>
                  Fecha de expiración
                </div>
              </div>
              <div className="mdl-cell--6">
                {
                  str
                }
              </div>
            </div>
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <Link to={`/students/get/${this.props.activity._id}`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver detalles</Link>
          </div>
        </div>
      </div>
     );
   }
 }
