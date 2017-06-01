import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Level} from '../cards/level'

@withRouter
 export class View extends React.Component <Props.teacherView, {levels: Array<CRUD.level>}>{
   public session: User.session;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       levels: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window.settings.uri}/v1/learning/domain/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((domain: CRUD.domain) => {
       this.setState({
         levels: domain.levels
       })
     });
   }
   render(){
     let body: any = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.levels){
       body = this.state.levels.map((row) => {
         return (
           <Level session={this.session} level={row} key={row._id}/>
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
