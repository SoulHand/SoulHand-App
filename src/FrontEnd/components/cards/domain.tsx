import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class Domain extends React.Component <Card.domain, {}>{
   render(){
     return(
      <div className="demo-cards mdl-cell mdl-cell--4-col mdl-cell--8-col-tablet mdl-grid mdl-grid--no-spacing">
        <div className="demo-updates mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--4-col-tablet mdl-cell--12-col-desktop">
          <div className="mdl-card__title mdl-card--expand mdl-color--teal-300">
            <h2 className="mdl-card__title-text">{this.props.domain.name}</h2>
          </div>
          <div className="mdl-card__supporting-text mdl-color-text--grey-600">
            {this.props.domain._id}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <Link to={`/domains/get/${this.props.domain._id}`} className="mdl-button mdl-js-button mdl-js-ripple-effect">Ver niveles</Link>
          </div>
        </div>
      </div>
     );
   }
 }
