import * as React from 'react';
import {Router, Route, hashHistory, IndexRoute} from 'react-router';
import *as validator from "validator";
import {render} from 'react-dom';
import 'bootstrap';


class container extends React component{

	render (){
		return(
<div class="container">
<h1>Form</h1>
{this.props.children}
</div>
);
	}render ((<container/>), body);
	}


componentDidMount(){
	try{
		var menu=document.getElementById("menu");
		if (validator.isfullname()(menu.(/a)e)){
			throw new exception ("El campo es invalido");
			
		}if
	} catch(error){
		alert(error.tostring());
	}
}


var body=document.getElementsByTagName('body') [0];
render(<div class="menu navbar navbar-default navbar-static-top" id="menu">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-ex-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand titulo" id="home"><span><b>SOULHAND</b></span></a>
        </div>
        <div class="collapse navbar-collapse" id="navbar-ex-collapse">
          <ul class="nav navbar-left navbar-nav">
            <li class="dropdown menu" id="persona">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span>Persona</span> <i class="fa fa-caret-down text-muted"></i></a>
              <ul class="dropdown-menu" role="menu">
                <li>
                  <a href="#">Docente</a>
                </li>
                <li class="divider"></li>
                <li>
                  <a href="#">Estudiante</a>
                </li>
                <li class="divider"></li>
                <li>
                  <a href="#">Represetante</a>
                </li>
              </ul>
            </li>
            <li class="dropdown titulo" id="pensus">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span>Pensus</span> <i class="fa fa-caret-down text-muted"></i></a>
              <ul class="dropdown-menu" role="menu">
                <li>
                  <a href="#">Grado</a>
                </li>
                <li class="divider"></li>
                <li>
                  <a href="#">Periodo Escolar</a>
                </li>
              </ul>
            </li>
            <li class="dropdown titulo" id="actividad">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false"><span>Actividades</span> <i class="fa fa-caret-down text-muted"></i></a>
              <ul class="dropdown-menu" role="menu"></ul>
            </li>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <li class="sesion" id="cerrar">
              <a href="#" id="Cerrar "><span> Cerrar Sesión</span></a>
            </li>
          </ul>
          <form class="navbar-form navbar-right text-right" role="search" id="buscar">
            <div class="form-group has-success">
              <input type="text" class="form-control" placeholder="Buscar">
            </div>
            <button type="submit" class="btn btn-default btn-sm" id="buscar">Buscar</button>
          </form>
          <ul class="nav navbar-left navbar-nav">
            <li class="titulo">
              <a href="#"><span><b> Mi Perfil</b></span></a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="seccion section text-center">
      <div class="container">
        <div class="row">
          <div class="col-md-12 from">
            <img src="..\Documents\SoulHand\InterfacesApp\css\images\user-login-icon-14.png" class="img-circle img-responsive imagen" id="logo">
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 from text-center">
            <form class="form-horizontal from text-center" role="form">
              <div class="form-group has-feedback mmmmm" id="usuario">
                <div class="col-sm-2">
                  <label for="inputEmail3" class="control-label">Usuario</label>
                </div>
                <div class="col-sm-10" id="usuario">
                  <input type="text" class="form-control cuadro" id="usuario" placeholder="Usuario">
                </div>
                <div class="col-sm-offset-2 col-sm-10">
                  <p class="help-block text-left">Introduzaca su nombre de usuario.</p>
                </div>
              </div>
              <div class="form-group" id="password">
                <div class="col-sm-2">
                  <label for="inputEmail3" class="control-label">Contraseña</label>
                </div>
                <div class="col-sm-10 cuadro">
                  <input type="password" class="form-control cuadro" id="Password" placeholder="Contraseña">
                </div>
                <div class="col-sm-offset-2 col-sm-10">
                  <p class="help-block text-left">Introduzca su contraseña.</p>
                </div>
              </div>
              <div class="form-group">
                <button type="submit" class="boton-e btn btn-block btn-lg btn-success" data-toggle="modal" id="entrar">Entrar</button>
              </div>
            </form>
            <a class="boton-r btn btn-lg btn-primary" id="registrar">Registrar</a>
          </div>
        </div>
      </div>
    </div>);




