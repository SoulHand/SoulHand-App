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
      let parent=document.getElementById("home");
      let canvas=parent.querySelector("canvas#media").getContext("2d");
      JVision.ouput=canvas;
      JVision.parent=parent;     
      TouchDesktop();
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
