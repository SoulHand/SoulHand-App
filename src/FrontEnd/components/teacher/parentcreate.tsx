import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'

@withRouter
 export class ParentCreate extends FormUtils<{router: any}, {}>{
   public fields:compat.Map={
 		dni:{
 			match:validator.matches(/^[VE][0-9]+$/i),
 			value:null,
 			required:true
 		},
 		name:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:null,
 			required:true
 		},
 		phone:{
 			match:(fn:string)=>{
 				return /^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/.test(fn);
 			},
 			value:null
 		},
 		email:{
 			match:validator.isEmail(),
 			value:null,
 			required:true
 		},
 		birthdate:{
 			match:validator.isDate(),
 			value:null,
 			required:true
 		},
 		interprete:{
 			value:null
 		},
 		genero:{
 			value:null,
      required:true,
      match: (str: string) => {
        return !validator.isNull()(str);
      }
 		}
 	};
  state: {error: compat.Map} = {
    error:{}
  }
  send(event: any){
    var values: compat.Map = {};
    var error = false;
    for(var i in this.fields){
      this.state.error[i] = !super.validate(this.fields[i].value, i);
      values[i] = this.fields[i].value;
      error = error || this.state.error[i];
    }
    this.setState(this.state);
    if (error) {
      return;
    }
    ajax({
			method:"POST",
	        url: `${window.settings.uri}/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:values,
	        success:(data:any)=>{
	        	this.props.router.replace('/teachers');
	        },
	        error:(data:any)=>{
	        	var state: CRUD.codeError = data.responseJSON;
	        	console.log(state);
	        }
		});
  }
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/teachers"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" onClick={(e:any)=>{this.send(e)}}>
             <i className="material-icons">check</i>
           </button>

         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
          <div className="mdl-grid mdl-color--white demo-content">
               <div className="mdl-cell mdl-cell--6-col">
                 <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.dni) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="dni" pattern="^[VE][0-9]{5,11}" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="dni">Cedula*</label>
                   <span className="mdl-textfield__error">Es necesaria un cedula valida</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
                  <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.name) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="name" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="name">Nombre y Apellido*</label>
                   <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
               <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.phone) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="tel" id="phone" pattern="^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="phone">Telefono*</label>
                   <span className="mdl-textfield__error">Es necesaria un telefono</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
               <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.email) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="email" id="email" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="email">Email*</label>
                   <span className="mdl-textfield__error">Es necesaria un correo valido</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
               <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.birthdate) ? 'is-invalid' :'')}>
                   <input className="mdl-textfield__input" type="text" id="birthdate" pattern="^[0-9]{2}\-[0-9]{2}-[0-9]{4}$" onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="birthdate">Fecha de nacimiento*</label>
                   <span className="mdl-textfield__error">Es necesaria una fecha en formato d-m-Y</span>
                 </div>
               </div>
               <div className="mdl-cell mdl-cell--6-col">
                 <label className="label static" htmlFor="genero">Genero*</label>
                 <select className="mdl-textfield__input" id="genero" onChange={(e:any)=>{this.getFields(e)}}>
                   <option value="">Seleccione una opción</option>
                   <option value="MASCULINO">MASCULINO</option>
                   <option value="FEMENINO">FEMENINO</option>
                 </select>
                 {(this.state.error.genero) && (
                   <span style={{color: "rgb(222, 50, 38)"}}>Seleccione un genero</span>
                 )}
               </div>
             </div>
          </main>
       </div>
     );
   }
 }
