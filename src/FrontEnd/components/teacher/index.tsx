import * as React from 'react'
import {Header} from '../app/header'
import {Menu} from '../app/menu'
import {List} from './list'
import {Create} from './create'

 export class Teacher extends React.Component <{}, {}>{
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


export let Teachers = List;
export let Add = Create;
