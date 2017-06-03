import * as React from 'react'
import {Link, withRouter} from 'react-router'


@withRouter
 export class Grade extends React.Component <{grade: CRUD.grade},{}>{
   render(){
     return (
       <div className="mdl-grid mdl-color--white demo-content">
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Nombre</label>
            <div className="mdl-textfield__input">
              {this.props.grade.name}
            </div>
          </div>
        </div>
       </div>
     );
   }
 }
