"use strict";
var React = require("react");
var react_router_1 = require("react-router");
var react_dom_1 = require("react-dom");
require("jquery");
require("tether");
require("bootstrap");
require("./scss/main.scss");
var App_1 = require("./App");
var PageIndex_1 = require("./templates/PageIndex");
var Login_1 = require("./templates/Login");
var PageTeacher_1 = require("./templates/PageTeacher");
var PageTeacherCreate_1 = require("./templates/PageTeacherCreate");
window.addEventListener("load", function () {
    react_dom_1.render((React.createElement(react_router_1.Router, { history: react_router_1.hashHistory },
        React.createElement(react_router_1.Route, { path: "/", component: App_1.App },
            React.createElement(react_router_1.IndexRoute, { component: PageIndex_1.PageIndex })),
        React.createElement(react_router_1.Route, { path: "/auth", component: App_1.App },
            React.createElement(react_router_1.IndexRoute, { component: Login_1.Login })),
        React.createElement(react_router_1.Route, { path: "/teacher", component: App_1.App },
            React.createElement(react_router_1.IndexRoute, { component: PageTeacher_1.PageTeacher }),
            React.createElement(react_router_1.Route, { path: "create", component: PageTeacherCreate_1.PageTeacherCreate })))), document.body);
});
//# sourceMappingURL=main.js.map