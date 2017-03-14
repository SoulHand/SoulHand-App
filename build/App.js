"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var NavBar_1 = require("./templates/NavBar");
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        return _super.apply(this, arguments) || this;
    }
    App.prototype.componentDidMount = function () {
        var session = localStorage.getItem("session");
        if (!session) {
            react_router_1.hashHistory.push('/auth');
        }
        this.setState({
            user: JSON.parse(session)
        });
    };
    App.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(NavBar_1.NavBar, null),
            this.props.children));
    };
    return App;
}(React.Component));
exports.App = App;
//# sourceMappingURL=App.js.map