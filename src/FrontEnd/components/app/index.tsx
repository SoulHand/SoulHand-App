import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Header, HeaderBack, HeaderFree, HeaderSearch, HeaderTabSearch} from './header'
import {Menu} from './menu'


 export class App extends React.Component <{title?: string}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
     window.progress.parent = ReactDOM.findDOMNode(this).querySelector("div#progress.mdl-js-progress");
   }
   render(){
     return(
       <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <Header title={this.props.title}/>
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden"/>
          <Menu/>
          <main className="mdl-layout__content mdl-color--grey-100">
          {this.props.children}
          </main>
       </div>
     );
   }
 }

 export class ModalSearch extends React.Component<{ filter: any, title?: string}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
     window.progress.parent = ReactDOM.findDOMNode(this).querySelector("div#progress.mdl-js-progress");
   }
   render(){
     return(
       <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">
          <HeaderSearch filter={this.props.filter} title={this.props.title}/>
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden"/>
          <Menu/>
          <main className="mdl-layout__content mdl-color--grey-100">
          {this.props.children}
          </main>
       </div>
     );
   }
 }

 export class ModalTabSearch extends React.Component<{ filter: any, title?: string, menu: any}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
     window.progress.parent = ReactDOM.findDOMNode(this).querySelector("div#progress.mdl-js-progress");
   }
   render(){
     return(
       <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header mdl-layout--fixed-tabs mdl-layout__header--scroll">
          <HeaderTabSearch filter={this.props.filter} title={this.props.title} menu={this.props.menu}/>
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden"/>
          <Menu/>
          <main className="mdl-layout__content">
            {this.props.children}
          </main>
        </div>
     );
   }
 }

 export class ModalApp extends React.Component<{ success: any, title?: string, label ?: string}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
     window.progress.parent = ReactDOM.findDOMNode(this).querySelector("div#progress.mdl-js-progress");
   }
   render(){
     return(
       <div className="mdl-layout mdl-layout--fixed-header">
         <HeaderBack success={this.props.success} title={this.props.title} label={this.props.label}/>
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden"/>
          <main className="mdl-layout__content mdl-color--grey-100">
            {this.props.children}
          </main>
       </div>
     );
   }
 }

 export class ModalFree extends React.Component<{ menu?: any, title?: string}, {}>{
   componentDidMount(){
     componentHandler.upgradeAllRegistered();
     window.progress.parent = ReactDOM.findDOMNode(this).querySelector("div#progress.mdl-js-progress");
   }
   render(){
     return(
       <div className="mdl-layout mdl-layout--fixed-header">
         <HeaderFree menu={this.props.menu} title={this.props.title}/>
          <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden"/>
          <main className="mdl-layout__content mdl-color--grey-100">
            {this.props.children}
          </main>
       </div>
     );
   }
 }
