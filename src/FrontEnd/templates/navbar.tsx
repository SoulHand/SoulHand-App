import * as React from 'react';

export class NavBar extends React.Component<{}, {}> {
	saludo(){
		console.log("hola!")
	}
  render () {
    return (
		<h1>hola mundo!</h1>
    );
  }
}
