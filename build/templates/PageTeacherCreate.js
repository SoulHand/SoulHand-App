"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var PageTeacherCreate = (function (_super) {
    __extends(PageTeacherCreate, _super);
    function PageTeacherCreate() {
        return _super.apply(this, arguments) || this;
    }
    PageTeacherCreate.prototype.render = function () {
        return (React.createElement("div", { className: "container card" },
            React.createElement("h3", null, "Registrar Docente"),
            React.createElement("form", { method: "POST", className: "formulario" },
                React.createElement("label", { htmlFor: "ci" },
                    React.createElement("b", null, "Cedula")),
                React.createElement("input", { type: "texto", className: "form-control", id: "ci", "aria-describedby": "ci_docente", maxLength: 12, placeholder: "V123456789", required: true, autoFocus: true }),
                React.createElement("small", { id: "ci_docente", className: "form-text text-muted" }, "Introduzca su Cedula."),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "nombre_docente" },
                        React.createElement("b", null, "Nombre")),
                    React.createElement("input", { type: "texto", className: "form-control", id: "nombre_docente", "aria-describedby": "nombre_docente", maxLength: 20, placeholder: "XXXXXXXX", required: true, autoFocus: true }),
                    React.createElement("small", { id: "nombre_docente", className: "form-text text-muted" }, "Introduzca su nombre.")),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "apellido_docente" },
                        React.createElement("b", null, "Apellido")),
                    React.createElement("input", { type: "texto", className: "form-control", id: "apellido_docente", "aria-describedby": "apellido_docente", placeholder: "XXXXXXXX", maxLength: 20, required: true, autoFocus: true }),
                    React.createElement("small", { id: "apellido_docente", className: "form-text text-muted" }, " Introduzca su Apellido.")),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "Telefono" },
                        React.createElement("b", null, "Telefono")),
                    React.createElement("input", { type: "texto", className: "form-control", id: "Telefono", "aria-describedby": "Telefono", placeholder: "XXXXXXXX", maxLength: 12 })),
                React.createElement("div", { className: "form-group" },
                    React.createElement("label", { htmlFor: "exampleInputEmail1" },
                        React.createElement("b", null, "Email ")),
                    React.createElement("input", { type: "email", className: "form-control", id: "exampleInputEmail1", "aria-describedby": "emailHelp", placeholder: "Email" }),
                    React.createElement("small", { id: "emailHelp", className: "form-text text-muted" }, "Introduzca su correo.")),
                React.createElement("fieldset", { className: "form-group" },
                    React.createElement("legend", null,
                        React.createElement("b", null, "Interprete")),
                    React.createElement("div", { className: "form-check" },
                        React.createElement("label", { className: "form-check-label" },
                            React.createElement("input", { type: "radio", className: "form-check-input", name: "optionsRadios", id: "optionsRadios1", value: "option1", checked: true }),
                            "Si")),
                    React.createElement("div", { className: "form-check" },
                        React.createElement("label", { className: "form-check-label" },
                            React.createElement("input", { type: "radio", className: "form-check-input", name: "optionsRadios", id: "optionsRadios2", value: "option2" }),
                            "No"))),
                React.createElement("button", { type: "submit", className: "btn btn-primary" }, "Guardar"))));
    };
    return PageTeacherCreate;
}(React.Component));
exports.PageTeacherCreate = PageTeacherCreate;
//# sourceMappingURL=PageTeacherCreate.js.map