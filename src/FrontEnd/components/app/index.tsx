import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Header, HeaderBack} from './header'
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

 export class ModalApp extends React.Component <{success: any, title?: string}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
     window.progress.parent = ReactDOM.findDOMNode(this).querySelector("div#progress.mdl-js-progress");
   }
   render(){
     return(
       <div className="demo-layout mdl-layout mdl-layout--fixed-header">
          <HeaderBack success={this.props.success} title={this.props.title}/>
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden"/>
          <main className="mdl-layout__content mdl-color--grey-100">
            {this.props.children}
          </main>
       </div>
     );
   }
 }
