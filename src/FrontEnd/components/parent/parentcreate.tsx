import * as React from 'react'
import {withRouter} from 'react-router'
import {Link} from 'react-router'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'

@withRouter
 export class ParentCreate extends FormUtils<{router: any}, {}>{
   public fields:compat.Map={
 		dni:{
 			match:validator.matches(/^[0-9]{5,11}$/i),
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
 		nacionality:{
 			match:(fn:string)=>{
 				return !validator.isNull()(fn);
 			},
 			value:'V',
 			required:true
 		},
 		tel:{
 			match:(fn:string)=>{
 				return /^[+]?([\d]{0,3})?[\(\.\-\s]?(([\d]{1,3})[\)\.\-\s]*)?(([\d]{3,5})[\.\-\s]?([\d]{4})|([\d]{2}[\.\-\s]?){4})$/.test(fn);
 			},
 			value:null
 		},
 		birthdate:{
 			match:(str: string) => {
        return /^[0-9]{2}\-[0-9]{2}-[0-9]{4}$/.test(str);
      },
 			value:null,
 			required:true
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
    values.dni = values.nacionality + values.dni;
    delete values.nacionality;
    ajax({
			method:"POST",
	        url: `${window._BASE}/v1/people/parents/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:values,
	        success:(data:any)=>{
	        	this.props.router.replace('/parents');
	        },
	        error:(data:any)=>{
	        	var state: CRUD.codeError = data.responseJSON;
            var config = {
              message: state.message,
              timeout: 2000
            };
            var message: any = document.querySelector('.mdl-js-snackbar')
            console.log(message);
            message.MaterialSnackbar.showSnackbar(config);
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
        <div className="mdl-layout__drawer-button"><Link to="/parents"><i className="material-icons">&#xE5C4;</i></Link></div>
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
                <div className="mdl-grid">
                   <div className="mdl-cell mdl-cell--2-col">
                   <div className={"mdl-textfield mdl-js-textfield "+((this.state.error.dni) ? 'is-invalid' :'')}>
                     <select className="mdl-textfield__input" id="nacionality" onChange={(e:any)=>{this.getFields(e)}}>
                       <option value="V">V</option>
                       <option value="E">E</option>
                     </select>
                    </div>
                   </div>
                   <div className="mdl-cell mdl-cell--4-col">
                     <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.dni) ? 'is-invalid' :'')}>
                       <input className="mdl-textfield__input" type="text" id="dni" pattern="^[0-9]{5,11}$" onChange={(e:any)=>{this.getFields(e)}}/>
                       <label className="mdl-textfield__label" htmlFor="dni">Cedula*</label>
                       <span className="mdl-textfield__error">Es necesaria un cedula valida</span>
                     </div>
                   </div>
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
                <div className={"mdl-textfield mdl-js-textfield mdl-textfield--floating-label "+((this.state.error.tel) ? 'is-invalid' :'')}>
<input className="mdl-textfield__input" type="tel" id="tel" pattern='^[+]?([\\d]{0,3})?[\\(\\.\\-\\s]?(([\\d]{1,3})[\\)\\.\\-\\s]*)?(([\\d]{3,5})[\\.\\-\\s]?([\\d]{4})|([\\d]{2}[\\.\\-\\s]?){4})$' onChange={(e:any)=>{this.getFields(e)}}/>
                   <label className="mdl-textfield__label" htmlFor="tel">Telefono*</label>
                   <span className="mdl-textfield__error">Es necesaria un telefono</span>
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
