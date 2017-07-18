import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Cognition} from '../cards/cognition'

@withRouter
 export class CognitionView extends React.Component <Props.objetiveView, CRUD.objetive>{
   public session: User.session;
   public cognitions: Array<CRUD.cognition> = [];
   constructor(props:Props.objetiveView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   delete(cognition: CRUD.cognition){
     let obj = this.cognitions.filter((row) => {
       if (row._id === cognition._id) {
         return false;
       }
       return true;
     })
     this.setState({
       cognitions: obj
     });
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/objetives/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((cognition: CRUD.objetive) => {
       this.cognitions = cognition.cognitions;
       this.setState(cognition);
     });
     componentHandler.upgradeAllRegistered();
   }
   render(){
     if(!this.state){
       return (
         <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
         </div>
       );
     }
     let body: any = (
       <span className="text-align center">No posee funciones cognitivas asociadas</span>
     );
     if(this.state.cognitions.length > 0){
       body = this.state.cognitions.map((row) => {
         return (
           <Cognition session={this.session} cognition={row} key={row._id} delete={this.delete.bind(this)} domain={this.props.routeParams.domain} level={this.props.routeParams.level}/>
         );
       })
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to="/domains"><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
           <div className="mdl-layout-spacer"></div>
             <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
               <i className="material-icons">more_vert</i>
             </button>
           <ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
             <li className="mdl-menu__item"><Link to={`/objetives/get/${this.props.routeParams.id}/cognition`}>Asignar funciones cognitivas</Link></li>
           </ul>
         </div>
       </header>
         <main className="mdl-layout__content mdl-color--white-100">
           <div className="demo-content">
             <div className="mdl-grid mdl-color--white">
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Nombre:</label>
                  <div className="mdl-textfield__input">
                    {this.state.name}
                  </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Descripción</label>
                  <div className="mdl-textfield__input">
                    {this.state.description}
                  </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Dominio</label>
                  <div className="mdl-textfield__input">
                    {this.state.domain.name}
                  </div>
                </div>
              </div>
              <div className="mdl-cell--6-col mdl-cell--middle">
                <div className="mdl-textfield">
                  <label className="mdl-input__expandable-holder">Nivel</label>
                  <div className="mdl-textfield__input">
                    ({this.state.level.level}) {this.state.level.name}
                  </div>
                </div>
              </div>
             </div>
             <h4>Palabras claves</h4>
             {this.state.words.map((row) => {
               return (
                 <span className="mdl-chip">
                    <span className="mdl-chip__text">{row}</span>
                </span>
               );
             })}
             <h3>Funciones cognitivas desarrollables</h3>
             <div className="mdl-grid mdl-color--white demo-content">
              {body}
             </div>
           </div>
         </main>
       </div>
     );
   }
 }
