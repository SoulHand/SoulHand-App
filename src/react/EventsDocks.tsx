export let DockMainEvents=()=>{
	let canvas=document.querySelector("div#home > canvas#media");
	let container=document.getElementById("container");
        container.querySelector("div#home > div.docks#mainbox a#config").addEventListener("click",()=>{
            container.classList.toggle("slider");
        });
        container.querySelector("div#home > div.docks#mainbox a#big").addEventListener("click",()=>{
            if(document.body.webkitRequestFullScreen) {
                document.body.webkitRequestFullScreen();
            } else if( document.body.mozRequestFullScreen) {
                document.bodssy.mozRequestFullScreen();
            }
        });
        container.querySelector("div#home > div.docks#mainbox a#camera").addEventListener("click",()=>{
            var a=document.createElement("a");
            a.href=canvas.toDataURL("image/png");
            a.download="captura.png";
            var clicEvent = new MouseEvent('click', {
                 'view': window,
                 'bubbles': true,
                 'cancelable': true
            });
            a.dispatchEvent(clicEvent);                    
        }); 
        container.querySelector("div#home > div.docks#mainbox a#importFile").addEventListener("click",()=>{
            console.log(JVision.input);
            loadPath(JVision.input);
        });
};
let loadPath=(INPUT:any)=>{
    let input=document.createElement("input");
    input.type="file";
    input.accept="video/*";
    input.addEventListener("change",(event:EventTarget)=>{
        var file=event.target.files[0];
        INPUT.src=window.URL.createObjectURL(file);
    })
    input.click();
    console.log(input);
};