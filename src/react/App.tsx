import * as React from 'react';
import {Link} from 'react-router';
import {Menu} from './Menu';


export class App extends React.Component<{}, {}> {
  render () {
    return (
      <div className="content" id="container" data-align="left" data-transition="ease-out">
      	{this.props.children}
      	<Menu/>
      </div>      
    );
  }
}
