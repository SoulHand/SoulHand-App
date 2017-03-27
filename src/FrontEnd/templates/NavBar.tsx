import * as React from 'react';
import {Link} from 'react-router';

export class NavBar extends React.Component<{}, {}> {
	render () {
    return (
		  <div className="menu navbar navbar-default navbar-static-top" id="menu">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#navbar-ex-collapse">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand titulo" id="home"><span><b>SOULHAND</b></span></Link>
          </div>
          <div className="collapse navbar-collapse" id="navbar-ex-collapse">
            <ul className="nav navbar-left navbar-nav">
              <li className="dropdown menu" id="persona">             
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span>Persona</span> <i className="fa fa-caret-down text-muted"></i></a>
                <ul className="dropdown-menu" role="menu">
                  <li>
                    <Link to="/teacher">Docente</Link>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <a href="#">Estudiante</a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <a href="#">Represetante</a>
                  </li>
                </ul>
              </li>
              <li className="dropdown menu" id="pensus">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span>Pensus</span> <i className="fa fa-caret-down text-muted"></i></a>
                <ul className="dropdown-menu" role="menu">
                  <li>
                    <a href="#">Grado</a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <a href="#">Materia</a>
                  </li>
                </ul>
              </li>
              <li className="dropdown menu" id="actividad">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span>Actividades</span> <i className="fa fa-caret-down text-muted"></i></a>
                <ul className="dropdown-menu" role="menu"></ul>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown menu" id="sesion">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"> <i className="et-down fa fa-2x fa-user text-muted"></i></a>
                <ul className="dropdown-menu" role="menu">
                  <li>
                    <a href="#">Mi Perfil</a>
                  </li>
                  <li className="divider"></li>
                  <li>
                    <a href="#">Cerrar Sesión</a>
                  </li>
                </ul>
              </li>
            </ul>
            <form className="navbar-form navbar-right text-left" role="search" id="buscar">
              <div className="col-sm-10">
                <input type="text" className="form-control" placeholder="Buscar"/>
              </div>
            </form>
          </div>
          <ul className="nav navbar-left navbar-nav"></ul>
        </div>
      </div>
    );
  }
}
