import * as React from 'react'
import {Link} from 'react-router'
import {UserBox} from './userbox'

 export class Menu extends React.Component <{}, Obj.session>{
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.state ={
       session: JSON.parse(str)
     };
   }
   render(){
     return (
       <div className="demo-drawer mdl-layout__drawer mdl-color--blue-grey-900 mdl-color-text--blue-grey-50">
          <UserBox session={this.state.session}/>
          <nav className="demo-navigation mdl-navigation mdl-color--blue-grey-800">
          <Link to="/" className="mdl-navigation__link"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Inicio</Link>
          <div className="mdl-layout-spacer"></div>
          <Link to="/teachers" className="mdl-navigation__link"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Docentes</Link>
          <Link to="/parents" className="mdl-navigation__link"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Representantes</Link>


            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Alumnos</a>
            <div className="mdl-layout-spacer"></div>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">forum</i>Mis Actividades</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">flag</i>Dominios</a>
            <div className="mdl-layout-spacer"></div>
            <Link to="/matters" className="mdl-navigation__link"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">school</i>Materias</Link>
            <Link to="/grades" className="mdl-navigation__link"><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">recent_actors</i>Grados</Link>
          </nav>
       </div>
     );
   }
 }
