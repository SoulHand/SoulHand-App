"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var jquery_1 = require("jquery");
var Login = (function (_super) {
    __extends(Login, _super);
    function Login() {
        return _super.apply(this, arguments) || this;
    }
    Login.prototype.auth = function (username, password) {
        jquery_1.getJSON('//0.0.0:8080/v1/auth', {});
    };
    Login.prototype.render = function () {
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "box" },
                React.createElement("form", { className: "form-signin", onSubmit: true },
                    React.createElement("h2", { className: "form-signin-heading" }, "Iniciar Secci\u00F3n"),
                    React.createElement("label", { htmlFor: "nombre_usuario", className: "sr-only" }, "Nombre de usuario"),
                    React.createElement("input", { type: "email", id: "usuario", className: "form-control", placeholder: "usuario", required: true, autoFocus: true }),
                    React.createElement("label", { htmlFor: "contraseña", className: "sr-only" }, "Contrase\u00F1a"),
                    React.createElement("input", { type: "password", value: "", className: "form-control", id: "contraseña", maxLength: 18, required: true, autoFocus: true }),
                    React.createElement("button", { className: "btn btn-lg btn-primary btn-block", type: "submit" }, "Entrar")))));
    };
    return Login;
}(React.Component));
exports.Login = Login;
//# sourceMappingURL=Login.js.map