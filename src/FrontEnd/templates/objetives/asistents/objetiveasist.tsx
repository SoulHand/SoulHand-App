import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';
import {Step1} from './step1';
import {Step2} from './step2';
import {Step3} from './step3';
import {Step4} from './step4';
import {Step5} from './step5';

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
export let step2= Step2;
export let step3= Step3;
export let step4= Step4;
export let step5= Step5;
