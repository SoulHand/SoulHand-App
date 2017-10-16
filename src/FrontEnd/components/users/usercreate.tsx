import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter} from 'react-router';
import { FormUtils } from '../formutils'


@withRouter
export class UserCreate extends FormUtils<Props.GenericRouter, {}> {
	public fields:compat.Map={
		dni:{
			match:validator.matches(/[0-9]{6,9}$/i),
			value:null,
			required:true
		},
		nacionality: {
			match: (fn: string) => {
				return !validator.isNull()(fn);
			},
			value: 'V',
			required: true
		},
		username:{
			match:validator.isAlphanumeric(),
			value:null,
			required:true
		},
		email:{
			match:validator.isEmail(),
			value:null,
			required:true
		},
		password:{
			match: (fn: string) => {
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		}
	};
	state:any={
		error:{
			dni:false,
			name:false,
			password:false,
			email:false,
			duplicated:false
		}
	}
  componentDidMount(){
    componentHandler.upgradeAllRegistered();
  }
	send(event:any){
		event.preventDefault();
		var values: compat.Map = {};
		var error = false;
		var _button = event.target;
		for (var i in this.fields) {
			this.state.error[i] = !super.validate(this.fields[i].value, i);
			values[i] = this.fields[i].value;
			error = error || this.state.error[i];
		}
		console.log(error, this.state.error);
		this.setState(this.state);
		if (error) {
			return;
		}
		values.dni = values.nacionality + values.dni;
		delete values.nacionality;
		ajax({
			method:"POST",
	        url: `${window._BASE}/v1/users/`,
	        dataType: "json",
					data: values,
	        success:(data:any)=>{
	        	this.props.router.replace('/auth');
	        },
	        error:(data:any)=>{
            var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: 2000
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            message.MaterialSnackbar.showSnackbar(config);
	        }
		});
	}
	render () {
    return (
      <div className="demo-layout mdl-layout mdl-layout--fixed-header mdl-js-layout mdl-color--grey-100">
        <header className="demo-header mdl-layout__header mdl-layout__header--scroll mdl-color--grey-100 mdl-color-text--grey-800">
          <div className="mdl-layout__header-row">
            <span className="mdl-layout-title">SoulHand</span>
            <div className="mdl-layout-spacer"></div>
          </div>
        </header>
        <div className="demo-ribbon"></div>
        <main className="demo-main mdl-layout__content">
         <div className="mdl-cell mdl-cell--2-col mdl-cell--hide-tablet mdl-cell--hide-phone"></div>
         <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--8-col">
         <div className="section__circle-container__circle mdl-color--primary"></div>
         <div className=" demo-container mdl-grid">
             <form className="form-signin" onSubmit={this.send.bind(this)}>
								<div className="mdl-grid">
									<div className="mdl-cell mdl-cell--2-col mdl-col-middle">
										<div className={"mdl-textfield mdl-js-textfield " + ((this.state.error.dni) ? 'is-invalid' : '')}>
											<select className="mdl-textfield__input" id="nacionality" onChange={(e: any) => { this.getFields(e) }}>
												<option value="V">V</option>
												<option value="E">E</option>
											</select>
										</div>
									</div>
									<div className="mdl-cell mdl-cell--4-col">
										<div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.dni) ? 'is-invalid' : '')}>
											<input className="mdl-textfield__input" type="text" id="dni" pattern="^[0-9]{5,11}$" onChange={(e: any) => { this.getFields(e) }} />
											<label className="mdl-textfield__label" htmlFor="dni">Cedula*</label>
											<span className="mdl-textfield__error">Es necesaria un cedula valida</span>
										</div>
									</div>
								</div>
								<div className="mdl-cell mdl-cell--6-col">
									<div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.username) ? 'is-invalid' : '')}>
										<input className="mdl-textfield__input" type="text" name="username" id="username" onChange={(e: any) => { this.getFields(e) }} />
										<label className="mdl-textfield__label" htmlFor="username">Nombre de Usuario*</label>
										<span className="mdl-textfield__error">Es obligatorio</span>
									</div>
								</div>
								<div className="mdl-cell mdl-cell--6-col">
									<div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.username) ? 'is-invalid' : '')}>
                   <input className="mdl-textfield__input" type="email" name="email" id="email" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="email">Correo electrónico*</label>
                   <span className="mdl-textfield__error">Es obligatorio</span>
                 </div>
								</div>
								<div className="mdl-cell mdl-cell--6-col">
									<div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label " + ((this.state.error.password) ? 'is-invalid' : '')}>
                   <input className="mdl-textfield__input" type="password" name="password" id="password" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="password">Contraseña</label>
                   <span className="mdl-textfield__error">Es obligatorio</span>
                 </div>
								</div>
								<div className="mdl-cell mdl-cell--12-col mdl-col-middle">
                 <button className="mdl-button mdl-js-button mdl-button--raised button--colored" type="submit">Registrarse <i className="material-icons">navigate_next</i></button>                 
								</div>
             </form>
         </div>
       </div>
      </main>
    </div>
    );
  }
}
