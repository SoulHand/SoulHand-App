import * as React from 'react';

export class PageUserCreate extends React.Component<{}, {}> {
	render () {
    return (
		<div className="container card">
				<h3>Registrar Usuario</h3>
			<form method="POST" className="formulario">
				<label htmlFor="nombre_user"><b>Nombre</b></label>
				    <input type="texto" className="form-control" id="nombre_user" aria-describedby="nombre_user" maxLength={12} placeholder="V123456789" required autoFocus/>
				    <small id="nombre_user" className="form-text text-muted">Introduzca su Nombre.</small>
				  <div className="form-group">
				    <label htmlFor="exampleInputEmail1"><b>Email </b></label>
				    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Email" />
				    <small id="emailHelp" className="form-text text-muted">Introduzca su correo.</small>
				  </div>
				  <div className="form-group">
				    <label htmlFor="usuario"><b>Usuario</b></label>
				    <input type="texto" className="form-control" id="usuario" aria-describedby="usuario" placeholder="XXXXXXXX" maxLength={20} required autoFocus/>
				    <small id="usuario" className="form-text text-muted"> Introduzca su Usuario.</small>
				  </div>
				  <div className="form-group">
				    <label htmlFor="Contraseña"><b>Contraseña</b></label>
				    <input type="password" className="form-control" id="Contraseña" aria-describedby="Contraseña" placeholder="XXXXXXXX" maxLength={12}/>
				  </div>
				   				  
				  <fieldset className="form-group">
				    <legend><b>Tipo</b></legend>
				    <div className="form-check">
				      <label className="form-check-label">
				        <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios1" value="option1" checked/>
				        Administrador
				      </label>
				    </div>
				    <div className="form-check">
				    <label className="form-check-label">
				        <input type="radio" className="form-check-input" name="optionsRadios" id="optionsRadios2" value="option2"/>
				        Usuario
				      </label>
				    </div>
				    
				  </fieldset>
				  
				  <button type="submit" className="btn btn-primary">Guardar</button>
				</form>
      	</div>
    );
  }
}
