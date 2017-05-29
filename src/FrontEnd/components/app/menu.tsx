import * as React from 'react'
import {UserBox} from './userbox'

 export class Menu extends React.Component <{}, CRUD.session>{
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
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">home</i>Inicio</a>
            <div className="mdl-layout-spacer"></div>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Docentes</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Alumnos</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">people</i>Representantes</a>
            <div className="mdl-layout-spacer"></div>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">forum</i>Mis Actividades</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">flag</i>Dominios</a>
            <div className="mdl-layout-spacer"></div>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">local_offer</i>Materias</a>
            <a className="mdl-navigation__link" href=""><i className="mdl-color-text--blue-grey-400 material-icons" role="presentation">local_offer</i>Grados</a>
          </nav>
       </div>
     );
   }
 }
