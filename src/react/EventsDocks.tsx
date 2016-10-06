export let DockMainEvents=()=>{
	let canvas=document.querySelector("div#home > canvas#media");
	let container=document.getElementById("container");
    let playcontrol=container.querySelector("div#home > div.docks#playcall a#boxPlay");
    let volumencontrol=container.querySelector("div#home > div.docks#playcall a#sound");
        container.querySelector("div#home > div.docks#mainbox a#config").addEventListener("click",()=>{
            container.classList.toggle("slider");
        });
        container.querySelector("div#home > div.docks#mainbox a#big").addEventListener("click",()=>{
            if(document.body.webkitRequestFullScreen) {
                document.body.webkitRequestFullScreen();
            } else if( document.body.mozRequestFullScreen) {
                document.body.mozRequestFullScreen();
            }
        });
        container.querySelector("div#home > div.docks#mainbox a#camera").addEventListener("click",()=>{
            var a=document.createElement("a");
            a.href=JVsion.ouput.canvas.toDataURL("image/png");
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
        container.querySelector("div#home > div.docks#playcall a#stop").addEventListener("click",()=>{
            JVision.input.pause();
            JVision.input.currentTime=0;
        });
        container.querySelector("div#home > div.docks#toolbox a#paint").addEventListener("click",function(){
            document.querySelector("div#home >div.docks#paintbox").classList.toggle("hiden");
            this.classList.toggle("active");
        });
        volumencontrol.addEventListener("click",function(){
            if(JVision.input.muted==true){
                JVision.input.muted=false;
            }else{
                JVision.input.muted=true;
            }
        });
        JVision.input.addEventListener("play",()=>{
            playcontrol.classList.remove("play");
            playcontrol.classList.add("pause");
        })
        JVision.input.addEventListener("ended",()=>{
            playcontrol.classList.add("play");
            playcontrol.classList.remove("pause");
        })
        JVision.input.addEventListener("pause",()=>{
            playcontrol.classList.add("play");
            playcontrol.classList.remove("pause");
        })
        JVision.input.addEventListener("volumechange",()=>{           
            if(JVision.input.muted==true){
                volumencontrol.classList.add("mute");
                volumencontrol.classList.remove("sound");
                volumencontrol.title="Activar Sonido";
            }else{
                volumencontrol.classList.remove("mute");
                volumencontrol.classList.add("sound");
                volumencontrol.title="Desactivar Sonido";
            }
        })
        playcontrol.addEventListener("click",()=>{
            if(!JVision.input.paused && !JVision.input.end){
                JVision.input.pause();
            }else{
                JVision.input.play();
            }
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