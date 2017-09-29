import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Header} from './header'
import {Menu} from './menu'

 export class App extends React.Component <{}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
     window.progress.parent = ReactDOM.findDOMNode(this).querySelector("div#progress.mdl-js-progress");
   }
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
          <Header/>
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden"/>
          <Menu/>
          <main className="mdl-layout__content mdl-color--grey-100">
          {this.props.children}
          </main>
       </div>
     );
   }
 }
