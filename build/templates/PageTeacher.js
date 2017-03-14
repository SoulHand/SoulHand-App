"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var jquery_1 = require("jquery");
var PageTeacher = (function (_super) {
    __extends(PageTeacher, _super);
    function PageTeacher() {
        return _super.apply(this, arguments) || this;
    }
    PageTeacher.prototype.componentDidMount = function () {
        jquery_1.getJSON("//0.0.0:8080/v1/teachers/?token=", function (data) {
            console.log(data);
        });
    };
    PageTeacher.prototype.render = function () {
        return (React.createElement("div", { className: "container card" },
            React.createElement("form", { className: "navbar-form navbar-right" },
                React.createElement("div", { className: "right" },
                    React.createElement("input", { type: "text", className: "form-control", placeholder: "Buscar" }))),
            React.createElement("h3", null, "Docente"),
            React.createElement("table", { className: "table table-striped" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Nombre"),
                        React.createElement("th", null, "Apellido>"),
                        React.createElement("th", null, "Email"),
                        React.createElement("th", null, "interprete"),
                        React.createElement("th", null, "Modificar/Eliminar"))),
                React.createElement("tbody", null,
                    React.createElement("tr", null,
                        React.createElement("th", null,
                            React.createElement("h4", null)),
                        React.createElement("th", null,
                            React.createElement("h4", null)),
                        React.createElement("th", null,
                            React.createElement("h4", null)),
                        React.createElement("th", null,
                            React.createElement("h4", null)),
                        React.createElement("th", null,
                            React.createElement("button", { type: "button", className: "btn btn-warning" }, "Editar"),
                            React.createElement("button", { type: "button", className: "btn btn-danger" }, "Eliminar")))))));
    };
    return PageTeacher;
}(React.Component));
exports.PageTeacher = PageTeacher;
//# sourceMappingURL=PageTeacher.js.map