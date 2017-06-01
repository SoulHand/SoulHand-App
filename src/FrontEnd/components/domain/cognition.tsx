import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Cognition} from '../cards/cognition'

@withRouter
 export class CognitionView extends React.Component <Props.objetiveView, {cognitions: Array<CRUD.cognition>}>{
   public session: User.session;
   public cognitions: Array<CRUD.cognition> = [];
   constructor(props:Props.objetiveView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       cognitions: []
     };
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
       url: `${window.settings.uri}/v1/knowedge/objetives/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((cognition: CRUD.objetive) => {
       this.cognitions = cognition.cognitions;
       this.setState({
         cognitions: this.cognitions
       })
     });
   }
   render(){
     let body: any = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.cognitions){
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
         </div>
       </header>
         <main className="mdl-layout__content mdl-color--white-100">
           <div className="mdl-grid demo-content">
              {body}
           </div>
         </main>
       </div>
     );
   }
 }
