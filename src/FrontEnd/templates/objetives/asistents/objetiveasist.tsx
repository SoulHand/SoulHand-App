import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';
import {Step1} from './step1';

@withRouter
export class Asist extends React.Component<Props.GenericRouter, {}> {
	render () {
    return (
      <div className="content" data-app="soulhand-services" data-align="left">
        <div className="body">
          <div className="container">
            <section className="page">
              <div className="container-body">
								{this.props.children}                
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}

export let step1= Step1;
