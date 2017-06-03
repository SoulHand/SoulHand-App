import * as React from 'react'
import {FormUtils} from '../formutils'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Teacher} from '../cards/teacher'
import * as List from '../profiles/teacher'

@withRouter
 export class SetGrade extends FormUtils <Props.teacherView, compat.Map>{
   public session: User.session;
   public fields:compat.Map={
 		grade:{
 			value:null,
      required: true,
      match: (str: string) => {
        return !validator.isNull()(str);
      }
 		}
 	};
   state:compat.Map = {
      grade: "",
      error:{},
      grades:[]
   };
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     let p2 = ajax({
       method:"GET",
       url: `${window.settings.uri}/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     window.Promise.all([p1.done(), p2.done()]).then((data: any) => {
       let teacher: People.teacher = data[0];
       let grades: Array<CRUD.grade> = data[1];
       this.setState({
         teacher: teacher,
         grades: grades,
         grade: (teacher.grade) ? teacher.grade._id : null
       })
     });
   }
   getFields(event:any){
     super.getFields(event);
     this.state[event.target.id] = this.fields[event.target.id].value;
     this.setState(this.state);
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
     delete values.nacionality;
     ajax({
 			method:"PUT",
 	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}/grade/${values.grade}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:values,
          crossDomain: true,
 	        success:(data:any)=>{
 	        	this.props.router.replace(`/students/get/${this.props.routeParams.id}`);
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
   render(){
     let body = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.teacher){
       body = (
         <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-cell mdl-cell--6-col">
            <label className="label static" htmlFor="grade">Grados*</label>
            <select className="mdl-textfield__input" id="grade" onChange={(e:any)=>{this.getFields(e)}} value={this.state.grade}>
                <option value="">Seleccione una opción</option>
                {this.state.grades.map((row:CRUD.grade) => {
                  if (this.state.teacher.grade && this.state.teacher.grade._id == row._id) {
                    return (
                      <option value={row._id} key={row._id} selected>{row.name}</option>
                    );
                  }
                  return (
                    <option value={row._id} key={row._id}>{row.name}</option>
                  );
                })}
            </select>
            {(this.state.error.genero) && (
              <span style={{color: "rgb(222, 50, 38)"}}>Seleccione un grado</span>
            )}
          </div>
         </div>
       );
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/students"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
           {this.state.teacher && (
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" onClick={(e:any)=>{this.send(e)}}>
               <i className="material-icons">check</i>
             </button>
           )}
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            {body}
          </main>
       </div>
     );
   }
 }
