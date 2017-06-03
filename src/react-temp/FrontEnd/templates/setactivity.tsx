import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';

@withRouter
export class SetActivity extends React.Component<Props.GenericRouter, {}> {
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
