import * as React from 'react';
import {Link} from 'react-router';

export class NavBar extends React.Component<{}, {}> {
	render () {
    return (
		<nav className="navbar navbar-toggleable-md navbar-light bg-faded">
  <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <Link to="/" className="title">SoulHand</Link>
  <div className="collapse navbar-collapse" id="navbarNavDropdown">
    <ul className="navbar-nav">
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Gestion de Persona </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <Link to={'/teacher'} className="dropdown-item">Docente</Link>
          <a className="dropdown-item" href="#">Estudiante</a>
          <a className="dropdown-item" href="#">Representante</a>
        </div>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Gestion de Conocimiento </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a className="dropdown-item" href="#">Area de Funcion Cognitiva </a>
          <a className="dropdown-item" href="#">Conflicto Cognitivo </a>
          <a className="dropdown-item" href="#">Funcion Cognitiva</a>
          <a className="dropdown-item" href="#">Habilidades</a>
        </div>
      </li>
      <li className="nav-item dropdown">
        <a className="nav-link dropdown-toggle" href="http://example.com" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Gestion de Pensus</a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a className="dropdown-item" href="#">Grados </a>
          <a className="dropdown-item" href="#">Periodo Escolar </a>
        </div>
        </li>
      
    </ul>
  </div>
</nav>
    );
  }
}
