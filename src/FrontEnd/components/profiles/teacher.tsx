import * as React from 'react'
import {Link, withRouter} from 'react-router'


@withRouter
 export class Teacher extends React.Component <Obj.teacher,{}>{

   render(){
     return (
       <div className="mdl-grid mdl-color--white demo-content">
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Nombre Y Apellido</label>
            <div className="mdl-textfield__input">
              {this.props.teacher.data.name}
            </div>
          </div>
        </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Documento de identidad</label>
            <div className="mdl-textfield__input">
              {this.props.teacher.data.dni}
            </div>
          </div>
        </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Fecha de nacimiento</label>
            <div className="mdl-textfield__input">
              {this.props.teacher.data.birthdate}
            </div>
          </div>
        </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Creado en</label>
            <div className="mdl-textfield__input">
              {this.props.teacher.data.createDate}
            </div>
          </div>
        </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Grado</label>
            <div className="mdl-textfield__input">
              {(this.props.teacher.grade) ? (
                this.props.teacher.grade.name
              ) : (
                <span>No asignado</span>
              )}
            </div>
          </div>
        </div>
        <div className="mdl-cell--6-col mdl-cell--middle">
          <div className="mdl-textfield">
            <label className="mdl-input__expandable-holder">Interprete</label>
            <div className="mdl-textfield__input">
              {(this.props.teacher.interprete==true) ? (
                  <span>Si</span>
              ) : (
                <span>No</span>
              )}
            </div>
          </div>
        </div>
       </div>
     );
   }
 }
