//Configuraciones para entorno y escritorios
require("../vendor/material.min.js");


window.progress = {
    parent: null,
    isProgress: false,
    done: () => {
        window.progress.isProgress = false;
        if(!window.progress.parent){
            window.progress.parent = document.querySelector("div#progress.mdl-js-progress");
            if (!window.progress.parent){
                return;
            }
        }
        window.progress.parent.classList.add("hiden");
    },
    start: () => {
        window.progress.isProgress = true;
        if(!window.progress.parent){
            window.progress.parent = document.querySelector("div#progress.mdl-js-progress");
            if (!window.progress.parent){
                return;
            }
        }
        window.progress.parent.classList.remove("hiden");
    }
}