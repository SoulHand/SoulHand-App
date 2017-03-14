import * as React from 'react';

export class PageTeacherCreate extends React.Component<{}, {}> {
	render () {
    return (
		<div className="container card">
				<h3>Registrar Docente</h3>
			<form method="POST" className="formulario">
				<label htmlFor="ci"><b>Cedula</b></label>
				    <input type="texto" className="form-control" id="ci" aria-describedby="ci_docente" maxLength={12} placeholder="V123456789" required autoFocus/>
				    <small id="ci_docente" className="form-text text-muted">Introduzca su Cedula.</small>
				  <div className="form-group">
				    <label htmlFor="nombre_docente"><b>Nombre</b></label>
				    <input type="texto" className="form-control" id="nombre_docente" aria-describedby="nombre_docente" maxLength={20} placeholder="XXXXXXXX"required autoFocus/>
				    <small id="nombre_docente" className="form-text text-muted">Introduzca su nombre.</small>
				  </div>
				  <div className="form-group">
				    <label htmlFor="apellido_docente"><b>Apellido</b></label>
				    <input type="texto" className="form-control" id="apellido_docente" aria-describedby="apellido_docente" placeholder="XXXXXXXX" maxLength={20} required autoFocus/>
				    <small id="apellido_docente" className="form-text text-muted"> Introduzca su Apellido.</small>
				  </div>
				  <div className="form-group">
				    <label htmlFor="Telefono"><b>Telefono</b></label>
				    <input type="texto" className="form-control" id="Telefono" aria-describedby="Telefono" placeholder="XXXXXXXX" maxLength={12}/>
				  </div>
				   <div className="form-group">
				    <label htmlFor="exampleInputEmail1"><b>Email </b></label>
				    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
				    <small id="emailHelp" className="form-text text-muted">Introduzca su correo.</small>
				  </div>
				  
				  <fieldset className="form-group">
				    <legend><b>Interprete</b></legend>
				    <div className="form-check">
				      <label className="form-check-label">
				        <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" checked/>
				        Si
				      </label>
				    </div>
				    <div className="form-check">
				    <label className="form-check-label">
				        <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2"/>
				        No
				      </label>
				    </div>
				    
				  </fieldset>
				  
				  <button type="submit" className="btn btn-primary">Guardar</button>
				</form>
      	</div>
    );
  }
}
