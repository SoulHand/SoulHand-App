import * as React from 'react'
import {ajax} from 'jquery'
import {Link} from 'react-router'
import {Teacher} from '../cards/teacher'

 export class List extends React.Component <{}, {}>{
   public session: User.session;
   public teachers: Array<People.teacher>=[];
   state: { teachers:  Array<People.teacher>} = {
     teachers: []
   }
   constructor(props:{}){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   componentDidUpdate(){
     console.log("registrando!");
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window.settings.uri}/v1/people/teachers/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((teachers: Array<People.teacher>) => {
       this.setState({
         teachers: teachers
       })
     });
   }
   render(){
     return(
       <div className="mdl-grid demo-content">
          {this.state.teachers.map((row) => {
            return (
            <Teacher key={row._id} teacher={row}/>
            );
          })}
          <Link to="/teachers/create" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
       </div>
     );
   }
 }
