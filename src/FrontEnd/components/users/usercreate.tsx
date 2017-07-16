import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter} from 'react-router';

@withRouter
export class UserCreate extends React.Component<Props.GenericRouter, {}> {
	public fields:compat.Map={
		dni:{
			match:validator.matches(/^[VE][0-9]{6,9}$/i),
			value:null,
			required:true
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
			value:null,
			required:true
		},
		confirm:{
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
			confirm:false,
			duplicated:false
		}
	}
  componentDidMount(){
    componentHandler.upgradeAllRegistered();
  }
	public getFields(event:any){
		this.fields[event.target.id].value=event.target.value;
	}
	public getRadioButton(event:any){
		this.fields["interprete"].value= (event.target.id=="yes") ? true : undefined
		this.setState({
			radio:event.target.id
		});
	}
	public validate(){
		var value=true;
		var state:compat.Map=this.state.error;
		var data:compat.Map={
			dni:null,
			name:null,
			password:null,
			email:null,
			confirm:null
		};
		for (var i in this.fields){
			if( (this.fields[i].require && !this.fields[i].value) || (this.fields[i].match && !this.fields[i].match(this.fields[i].value))){
				value=false;
				state[i]=true;
				continue;
			}
				data[i]=this.fields[i].value;
				state[i]=false;
		}
		if(data.password!=data.confirm){
			value=false;
			state.duplicated=true;
		}
		state.server=null;
		if(!value){
			return false;
		}
		return data;
	}
	send(event:any){
		event.preventDefault();
		ajax({
			method:"POST",
	        url: `${window._BASE}/v1/users/`,
	        dataType: "json",
	        data:$(event.target).serialize(),
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
                 <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                   <input className="mdl-textfield__input" type="text" name="dni" id="dni" pattern="^[VE][0-9]{6,9}$" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="dni">Documento de identidad*</label>
                   <span className="mdl-textfield__error">Es obligatorio</span>
                 </div>
                 <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                   <input className="mdl-textfield__input" type="text" name="username" id="username" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="username">Nombre de Usuario*</label>
                   <span className="mdl-textfield__error">Es obligatorio</span>
                 </div>
                 <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                   <input className="mdl-textfield__input" type="email" name="email" id="email" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="email">Correo electrónico*</label>
                   <span className="mdl-textfield__error">Es obligatorio</span>
                 </div>
                 <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                   <input className="mdl-textfield__input" type="password" name="password" id="password" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="password">Contraseña</label>
                   <span className="mdl-textfield__error">Es obligatorio</span>
                 </div>
                 <button className="mdl-button mdl-js-button mdl-button--raised button--colored" type="submit">Registrarse <i className="material-icons">navigate_next</i></button>
             </form>
         </div>
       </div>
      </main>
    </div>
    );
  }
}
