import * as React from 'react';
import {Link} from 'react-router';
import {MainDock} from './Dockmain.tsx';
import {ToolDock} from './tooldock.tsx';
import {TouchDesktop} from './animations.tsx';
import {PlayBox} from './bottomdock.tsx';
import {PaintBox} from './paintbox.tsx';
import {DockMainEvents} from './EventsDocks.tsx';

export class Desktop extends React.Component<{}, {}> {
    componentWillUnmount(){
      console.log("DESKTOP SERA DESMONTADO!");
    }
	  componentDidMount(){
      let video=document.createElement("video");
      let canvas=document.querySelector("div#home > canvas#media").getContext("2d");
      TouchDesktop();
      console.log('load Desktop');      
      JVision.init(video,canvas,(data:Worker)=>{
        JVision.objects=data[1];
        for(var i=0,n=JVision.objects.length;i<n;i++){
          for(var j=0,m=JVision.objects[i].length;j<m;j++){                
            JVision.ouput.beginPath();
            JVision.ouput.rect(JVision.objects[i][j].x,JVision.objects[i][j].y,JVision.objects[i][j].width,JVision.objects[i][j].height);
            JVision.ouput.strokeStyle=(i==0) ? "red" : "blue";
            JVision.ouput.lineWeight=3;
            JVision.ouput.stroke();
          }
        }
      });
      video.addEventListener("canplay",()=>{
          document.getElementById("home").setAttribute("data-playing","true");
      })
      DockMainEvents();
    }
  render () {
    return (
	<div className="body" id="home" data-playing="false">
     	 <canvas id="media" className="media" width={_CONFIG.ouput.width} height={_CONFIG.ouput.height}></canvas>
     	 <MainDock/>
       <ToolDock/>
       <PaintBox/>
     	 <PlayBox/>
	</div>
    );
  }
}
