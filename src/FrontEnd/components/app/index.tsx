import * as React from 'react'
import {Header} from './header'
import {Menu} from './menu'

 export class App extends React.Component <{}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
   }
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
          <Header/>
          <Menu/>
          <main className="mdl-layout__content mdl-color--grey-100">
          {this.props.children}
          </main>
       </div>
     );
   }
 }
