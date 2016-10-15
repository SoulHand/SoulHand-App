import {drawFree,deleteDraw,drawClear,DeleteClear} from './animations.tsx';
let mediaStream:MediaSource,rec=false;
let recorder:any;
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
        container.querySelector("div#home > div.docks#mainbox a#capture").addEventListener("click",()=>{
           if(!mediaStream){
                getCamera();               
           }else{
               mediaStream.stop();
               this.classList.remove("active");
               mediaStream=null;
           }
        }); 
        container.querySelector("div#home > div.docks#playcall a#rec").addEventListener("click",function(){
          if(rec!=true){
            recorder= new RecordRTC(JVision.ouput.canvas,{
               type: 'canvas',
               disableLogs: false
            });
            recorder.startRecording();            
            this.disabled=true;
            rec=true;
            setTimeout(()=>{                
                this.disabled = false;
                this.classList.add("active");
            }, 1000);
          }else{
              setTimeout(()=>{
                  this.classList.remove("active");
                  rec=false;
                recorder.stopRecording(function() {
                   var blob = recorder.getBlob();
                   console.log(URL.createObjectURL(blob));
                });
        }, 100);
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
        container.querySelector("div#home > div.docks#paintbox a#drawFree").addEventListener("click",function(){
            let home=container.querySelector("div#home");
            if(home.dataset.type!=this.id){
                var a=home.querySelector("div.docks#paintbox a#"+home.dataset.type);
                if(a!=null){                    
                    a.click();
                }
            }
                this.classList.toggle("active");
                if(home.dataset.drawmode=="true" && home.dataset.type==this.id){
                    home.setAttribute("data-drawmode","false");
                    home.removeAttribute("data-type");
                    JVision.ouput.canvas.style.cursor="default";
                    deleteDraw();
                }else{
                    home.setAttribute("data-drawmode","true");
                    home.setAttribute("data-type",this.id);
                    JVision.ouput.canvas.style.cursor="crosshair";
                    drawFree();
                    document.querySelector("div.docks#mainbox").classList.add("hiden");
                    document.querySelector("div.docks#toolbox").classList.add("hiden");
                    document.querySelector("div.docks#playcall").classList.add("hiden");        
                }
        }); 
        container.querySelector("div#home > div.docks#paintbox a#removePaint").addEventListener("click",function(){
            JVision.overlap.clearRect(0,0,JVision.overlap.canvas.width,JVision.overlap.canvas.height);
            JVision.Render();
        });
        container.querySelector("div#home > div.docks#paintbox a#lineWeight").addEventListener("click",function(){
            _CONFIG.draw.line=parseInt(prompt("Ingrese un número del 1 hasta 20:"));
            if(_CONFIG.draw.line==NaN || (_CONFIG.draw.line<1 || _CONFIG.draw.line>20)){
               _CONFIG.draw.line=2;
            }
        });
        container.querySelector("div#home > div.docks#paintbox a#fontSize").addEventListener("click",function(){
            _CONFIG.draw.font=parseInt(prompt("Ingrese un número:"));
            if(_CONFIG.draw.font==NaN || (_CONFIG.draw.font<1 || _CONFIG.draw.font<=0)){
               _CONFIG.draw.font=38;
            }
        });
        container.querySelector("div#home > div.docks#paintbox a#fillColor").addEventListener("click",function(){
            var input=document.createElement("input");
                    input.type="color";
                    input.value=_CONFIG.draw.color;
                    input.addEventListener("change",function(){
                        _CONFIG.draw.color=this.value;
                    });
                    input.click();
        });
        container.querySelector("div#home > div.docks#paintbox a#clear").addEventListener("click",function(){
            let home=container.querySelector("div#home");
            if(home.dataset.type!=this.id){
                var a=home.querySelector("div.docks#paintbox a#"+home.dataset.type);
                if(a!=null){                    
                    a.click();
                }
            }
            this.classList.toggle("active");
            if(home.dataset.drawmode=="true" && home.dataset.type==this.id){
                home.setAttribute("data-drawmode","false");
                home.removeAttribute("data-type");
                JVision.ouput.canvas.style.cursor="default";
                DeleteClear();
            }else{
                home.setAttribute("data-drawmode","true");
                home.setAttribute("data-type",this.id);
                JVision.ouput.canvas.style.cursor="crosshair";
                drawClear();
                document.querySelector("div.docks#mainbox").classList.add("hiden");
                document.querySelector("div.docks#toolbox").classList.add("hiden");
                document.querySelector("div.docks#playcall").classList.add("hiden");        
            }
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
    input.addEventListener("change",(event:EventTarget):void=>{
        var file=event.target.files[0];
        INPUT.src=window.URL.createObjectURL(file);
    })
    input.click();
};
let getCamera=()=>{
    var constraint={video:true, audio:true};
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        navigator.getUserMedia (constraint, loadCamera,errorCamera);
    }else{
        navigator.mediaDevices.getUserMedia(constraint).then(loadCamera).catch(errorCamera);                                    
    }
};
let loadCamera=(resource:MediaSource)=>{
    mediaStream=resource;
    JVision.input.src=window.URL.createObjectURL(resource);
    document.querySelector("div#home > div.docks#mainbox a#capture").classList.add("active");
    JVision.input.play();
}
let errorCamera=(error:Error)=>{
    console.log(error)
}