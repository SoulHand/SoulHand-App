import * as React from 'react';
import * as $ from 'jquery';
import {Link} from 'react-router';

export class PageRepresentativeCreate extends React.Component<{}, {}> {
  render () {
    return (
     <div className="container card">
        <h3>Registrar Representante</h3>
      <form method="POST" className="formulario">
        <label htmlFor="ci"><b>Cedula</b></label>
            <input type="texto" className="form-control" id="ci" aria-describedby="ci_representante" maxLength={12} placeholder="V123456789" required autoFocus/>
            <small id="ci_representante" className="form-text text-muted">Introduzca su Cedula.</small>
          <div className="form-group">
            <label htmlFor="nombre_representante"><b>Nombre</b></label>
            <input type="texto" className="form-control" id="nombre_representante" aria-describedby="nombre_representante" maxLength={20} placeholder="XXXXXXXX"required autoFocus/>
            <small id="nombre_representante" className="form-text text-muted">Introduzca su nombre.</small>
          </div>
          <div className="form-group">
            <label htmlFor="apellido_representante"><b>Apellido</b></label>
            <input type="texto" className="form-control" id="apellido_representante" aria-describedby="apellido_representante" placeholder="XXXXXXXX" maxLength={20} required autoFocus/>
            <small id="apellido_representante" className="form-text text-muted"> Introduzca su Apellido.</small>
          </div>
          
           <div className="form-group">
            <label htmlFor="direccion_representante"><b>Direccion </b></label>
            <input type="texto" className="form-control" id="direccion_representante" aria-describedby="direccion_representante" placeholder="Email" />
            <small id="direccion_representante" className="form-text text-muted">Introduzca su Direccion.</small>
          </div>
           <div className="form-group">
            <label htmlFor="Telefono"><b>Telefono</b></label>
            <input type="texto" className="form-control" id="Telefono" aria-describedby="Telefono" placeholder="XXXXXXXX" maxLength={12}/>
          </div>                
          <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
        </div> );
  }
}
