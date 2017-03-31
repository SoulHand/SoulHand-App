import * as React from 'react';

export class PageStudentCreate extends React.Component<{}, {}> {
	render () {
    return (
     <div className="container card">
        <h3>Registrar Estudiante</h3>
      <form method="POST" className="formulario">
        <label htmlFor="ci"><b>Cedula</b></label>
            <input type="texto" className="form-control" id="ci" aria-describedby="ci_representante" maxLength={12} placeholder="V123456789" required autoFocus/>
            <small id="ci_representante" className="form-text text-muted">Introduzca su Cedula.</small>
          <div className="form-group">
            <label htmlFor="nombre_estudiante"><b>Nombre</b></label>
            <input type="texto" className="form-control" id="nombre_estudiante" aria-describedby="nombre_estudiante" maxLength={20} placeholder="XXXXXXXX"required autoFocus/>
            <small id="nombre_estudiante" className="form-text text-muted">Introduzca su nombre.</small>
          </div>
          <div className="form-group">
            <label htmlFor="apellido_estudiante"><b>Apellido</b></label>
            <input type="texto" className="form-control" id="apellido_estudiante" aria-describedby="apellido_estudiante" placeholder="XXXXXXXX" maxLength={20} required autoFocus/>
            <small id="apellido_estudiante" className="form-text text-muted"> Introduzca su Apellido.</small>
          </div>
          
           <div className="form-group">
            <label htmlFor="nombre_representante"><b>Representante</b></label>
            <input type="texto" className="form-control" id="nombre_representante" aria-describedby="nombre_representante" placeholder="Email" />
            <small id="nombre_representante" className="form-text text-muted">Introduzca su Nombre de Representante.</small>
          </div>
           <div className="form-group">
            <label htmlFor="fecha_nacimiento"><b>Fecha de Nacimiento</b></label>
            <input type="texto" className="form-control" id="fecha_nacimiento" aria-describedby="fecha_nacimiento" placeholder="XXXXXXXX" maxLength={12}/>
          </div>                
          <button type="submit" className="btn btn-primary">Guardar</button>
        </form>
        </div> )
    	);
  }
}