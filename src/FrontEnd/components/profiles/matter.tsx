import * as React from 'react'
import {Link, withRouter} from 'react-router'


@withRouter
 export class Matter extends React.Component <{matter: CRUD.course},{}>{
   render(){
     return (
       <div className="mdl-grid mdl-color--white demo-content">
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Nombre</label>
            <div className="mdl-textfield__input">
              {this.props.matter.name}
            </div>
          </div>
        </div>
       </div>
     );
   }
 }
