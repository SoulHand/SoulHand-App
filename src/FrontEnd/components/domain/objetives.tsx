import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import {Objetive} from '../cards/objetive'

@withRouter
 export class Objetives extends React.Component <Props.objetiveView, {objetives: Array<CRUD.objetive>}>{
   public session: User.session;
   public objetives: Array<CRUD.objetive> = [];
   constructor(props:Props.objetiveView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       objetives: null
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   Filter(event:any){
   		var filter=this.objetives.filter((row)=>{
   			var exp=new RegExp(event.target.value,"i");
   			if(exp.test(row.name)==true || exp.test(row.level.name)==true ||
          exp.test(row.description)==true || exp.test(row.domain.name)==true){
   				return true;
   			}
   			return false;
   		});
   		this.setState({
 	      	objetives : filter
 	    });
   	}
   delete(objetive: CRUD.objetive){
     let obj = this.objetives.filter((row) => {
       if (row._id === objetive._id) {
         return false;
       }
       return true;
     })
     this.setState({
       objetives: obj
     });
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/knowedge/${this.props.routeParams.domain}/objetives/${this.props.routeParams.level}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     p1.done((objetives: Array<CRUD.objetive>) => {
       this.objetives = objetives;
       this.setState({
         objetives: objetives
       })
     });
   }
   render(){
     let body: any = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.objetives){
       body = this.state.objetives.map((row) => {
         return (
           <Objetive session={this.session} objetive={row} key={row._id} delete={this.delete.bind(this)} domain={this.props.routeParams.domain} level={this.props.routeParams.level}/>
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
           <div className="mdl-textfield mdl-js-textfield mdl-textfield--expandable">
             <label className="mdl-button mdl-js-button mdl-button--icon" htmlFor="search">
               <i className="material-icons">search</i>
             </label>
             <div className="mdl-textfield__expandable-holder">
               <input className="mdl-textfield__input" type="text" id="search" onChange={(e:any)=>{this.Filter(e)}}/>
               <label className="mdl-textfield__label" htmlFor="search">Ingrese su consulta...</label>
             </div>
           </div>
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
