"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var react_router_1 = require("react-router");
var NavBar = (function (_super) {
    __extends(NavBar, _super);
    function NavBar() {
        return _super.apply(this, arguments) || this;
    }
    NavBar.prototype.render = function () {
        return (React.createElement("nav", { className: "navbar navbar-toggleable-md navbar-light bg-faded" },
            React.createElement("button", { className: "navbar-toggler navbar-toggler-right", type: "button", "data-toggle": "collapse", "data-target": "#navbarNavDropdown", "aria-controls": "navbarNavDropdown", "aria-expanded": "false", "aria-label": "Toggle navigation" },
                React.createElement("span", { className: "navbar-toggler-icon" })),
            React.createElement(react_router_1.Link, { to: "/", className: "title" }, "SoulHand"),
            React.createElement("div", { className: "collapse navbar-collapse", id: "navbarNavDropdown" },
                React.createElement("ul", { className: "navbar-nav" },
                    React.createElement("li", { className: "nav-item dropdown" },
                        React.createElement("a", { className: "nav-link dropdown-toggle", href: "http://example.com", id: "navbarDropdownMenuLink", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" }, "Gestion de Persona "),
                        React.createElement("div", { className: "dropdown-menu", "aria-labelledby": "navbarDropdownMenuLink" },
                            React.createElement(react_router_1.Link, { to: '/teacher', className: "dropdown-item" }, "Docente"),
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Estudiante"),
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Representante"))),
                    React.createElement("li", { className: "nav-item dropdown" },
                        React.createElement("a", { className: "nav-link dropdown-toggle", href: "http://example.com", id: "navbarDropdownMenuLink", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" }, "Gestion de Conocimiento "),
                        React.createElement("div", { className: "dropdown-menu", "aria-labelledby": "navbarDropdownMenuLink" },
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Area de Funcion Cognitiva "),
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Conflicto Cognitivo "),
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Funcion Cognitiva"),
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Habilidades"))),
                    React.createElement("li", { className: "nav-item dropdown" },
                        React.createElement("a", { className: "nav-link dropdown-toggle", href: "http://example.com", id: "navbarDropdownMenuLink", "data-toggle": "dropdown", "aria-haspopup": "true", "aria-expanded": "false" }, "Gestion de Pensus"),
                        React.createElement("div", { className: "dropdown-menu", "aria-labelledby": "navbarDropdownMenuLink" },
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Grados "),
                            React.createElement("a", { className: "dropdown-item", href: "#" }, "Periodo Escolar ")))))));
    };
    return NavBar;
}(React.Component));
exports.NavBar = NavBar;
//# sourceMappingURL=NavBar.js.map