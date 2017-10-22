import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { ajax } from 'jquery'
import { Link, withRouter } from 'react-router'
import * as List from '../profiles/grade'
import { HeaderFree } from '../app/header'
import { App, ModalFree } from '../app'


@withRouter
export class Licenses extends React.Component<Props.GenericRouter, {}> {
    componentDidMount() {
        var parent = ReactDOM.findDOMNode(this);
        var element = parent.querySelector("#content-license");
        element.innerHTML = LICENSE;
    }
    render() {
        return (
            <div className="mdl-layout mdl-layout--fixed-header">
                <HeaderFree title="Licencia GNU" />
                <div id="progress" className="mdl-progress mdl-js-progress mdl-progress__indeterminate progress hiden" />
                <div className="demo-ribbon mdl-color--teal-400" />
                <main className="demo-main mdl-layout__content">
                    <div className="demo-container mdl-grid">
                        <div className="demo-content mdl-color--white mdl-shadow--4dp content mdl-color-text--grey-800 mdl-cell mdl-cell--10-col" id="content-license"/>
                    </div>
                </main>
            </div>
        );
    }
}