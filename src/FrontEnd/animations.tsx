declare namespace MousePoint{
	interface Point{
		init?:MousePoint.coords
		center?:MousePoint.coords
		end?:MousePoint.coords
		distance?:MousePoint.distance
		promd?:MousePoint.distance
	}
	interface coords{
		x:number
		y:number	
	}
	interface distance{
		width:number
		height:number
	}
}
declare namespace Touch{
	interface EventMouse{
		clientX?:number
		clientY?:number
		touches:Array<Target>
		target:any
	}
	interface Target{
		clientX:number
		clientY:number
	}
}
interface DOMStringMap{
	drawmode?:string
	active?:string
}

type EventListener = { handleEvent(evt: Event): void } | Function;

let parent:HTMLElement, docks:Array<any>,mouse:MousePoint.Point,painter:MousePoint.Point;

let move=(event:Touch.EventMouse):void=>{
	mouse.end.x=mouse.init.x=(event.touches!=undefined)? event.touches[0].clientX : event.clientX;
	mouse.end.y=mouse.init.y=(event.touches!=undefined)? event.touches[0].clientY : event.clientY;
	parent.addEventListener("mousemove",moveend);
	parent.addEventListener("touchmove",moveend);
}
let moveend=(event:Touch.EventMouse):void=>{
	mouse.end.x=(event.touches!=undefined)? event.touches[0].clientX : event.clientX;
	mouse.end.y=(event.touches!=undefined)? event.touches[0].clientY : event.clientY;
};
let movecomplete=()=>{
	const _MARGIN=30;
		if(parent.dataset.drawmode!="true" && ((Math.abs(mouse.end.x - mouse.init.x)>=mouse.distance.width && Math.abs(mouse.end.y-mouse.init.y)<=_MARGIN) || (Math.abs(mouse.end.x-mouse.init.x)<=_MARGIN && Math.abs(mouse.end.y-mouse.init.y)>=mouse.distance.height))){        
			if(mouse.init.y<=mouse.center.y+mouse.distance.height){
				if(mouse.init.x<mouse.end.x && mouse.init.x<mouse.center.x){
					docks[0].classList.remove("hiden");
				}else if(mouse.init.x>mouse.end.x && mouse.init.x<mouse.center.x){
					docks[0].classList.add("hiden");
				}else if(mouse.init.x<mouse.end.x && mouse.init.x>mouse.center.x){
					docks[1].classList.add("hiden");
				}else if(mouse.init.x>mouse.end.x && mouse.init.x>mouse.center.x){        
					docks[1].classList.remove("hiden");
				}
			}else if(parent.dataset.playing=="true"){				
				if(mouse.init.x<mouse.end.x){
					docks[2].classList.remove("hiden");
				}else if(mouse.init.x>mouse.end.x){
					docks[2].classList.add("hiden");
				}
			}					      	
		}    
		parent.removeEventListener("mousemove",moveend);
		parent.removeEventListener("touchmove",moveend);
};
let ajustDock=()=>{
	mouse.center.x=Math.floor(window.innerWidth-(window.innerWidth/2));
	mouse.center.y=Math.floor(window.innerHeight-(window.innerHeight/2));
	mouse.distance.width=mouse.center.x*0.05;
	mouse.distance.height=mouse.center.y*0.05;	
};
export let deleteDraw=()=>{
	JVision.ouput.canvas.removeEventListener("mousedown",initPaint);
  	JVision.ouput.canvas.removeEventListener("touchstart",initPaint);
  	JVision.ouput.canvas.removeEventListener("mouseup",endPaint);
  	JVision.ouput.canvas.removeEventListener("touchend",endPaint);
}
export let drawFree=()=>{
	painter={
		init:{
			x:0,
			y:0
		},
		end:{
			x:0,
			y:0
		},
		promd:{
			width:(this.width*100)/this.clientWidth,
			height:(this.height*100)/this.clientHeight
		}
	};
	JVision.ouput.canvas.addEventListener("mousedown",initPaint);
  	JVision.ouput.canvas.addEventListener("touchstart",initPaint);
  	JVision.ouput.canvas.addEventListener("mouseup",endPaint);
  	JVision.ouput.canvas.addEventListener("touchend",endPaint);
};
export let TouchDesktop=()=>{
	parent=document.getElementById("home");
	docks=[
		parent.querySelector("div.docks#toolbox"),
		parent.querySelector("div.docks#mainbox"),
		parent.querySelector("div.docks#playcall")
	];
	mouse={
		init:{
				x:0,
				y:0
			},
			center:{
				x:0,
				y:0
			},
			end:{
				x:0,
				y:0
			},
			distance:{
				width:0,
				height:0
			}
	};
	parent.addEventListener("mousedown",move);
	parent.addEventListener("touchstart",move);
	parent.addEventListener("mouseup",movecomplete);
	parent.addEventListener("touchend",movecomplete);				
	window.addEventListener("resize",ajustDock);
	ajustDock();
};
export let drawClear=()=>{
	painter={
		init:{
			x:0,
			y:0
		},
		end:{
			x:0,
			y:0
		},
		promd:{
			width:(this.width*100)/this.clientWidth,
			height:(this.height*100)/this.clientHeight
		}
	};
	JVision.ouput.canvas.addEventListener("mousedown",initClear);
  	JVision.ouput.canvas.addEventListener("touchstart",initClear);
  	JVision.ouput.canvas.addEventListener("mouseup",endClear);
  	JVision.ouput.canvas.addEventListener("touchend",endClear);
}
export let DeleteClear=()=>{
	JVision.ouput.canvas.removeEventListener("mousedown",initClear);
	JVision.ouput.canvas.removeEventListener("touchstart",initClear);
	JVision.ouput.canvas.removeEventListener("mouseup",endClear);
	JVision.ouput.canvas.removeEventListener("touchend",endClear);
}

let draw=(x1:number,y1:number,x2:number,y2:number,color:string,line:number)=>{
	JVision.overlap.beginPath();
		JVision.overlap.moveTo(x1,y1);
		JVision.overlap.lineTo(x2,y2);
		JVision.overlap.strokeStyle=color;
		JVision.overlap.lineWidth=line;
		JVision.overlap.stroke();
}
let clear=(x:number,y:number,line:number)=>{
	JVision.overlap.clearRect(x,y,line,line);
}
function initPaint(event:Touch.EventMouse){
	var x=(event.touches!=undefined)? event.touches[0].clientX : event.clientX,y=(event.touches!=undefined)? event.touches[0].clientY : event.clientY;		
	var parent=event.target.getBoundingClientRect();
	painter.init.x=Math.floor(((x-parent.left)*this.width)/parent.width);
	painter.init.y=Math.floor(((y-parent.top)*this.height)/parent.height);
	this.addEventListener("mousemove",movePaint); 
	this.addEventListener("touchmove",movePaint);		
}
function endPaint(event:Touch.EventMouse){
	this.removeEventListener("mousemove",movePaint); 
	this.removeEventListener("touchmove",movePaint);
}
function movePaint(event:Touch.EventMouse){
	var x=(event.touches!=undefined)? event.touches[0].clientX : event.clientX,y=(event.touches!=undefined)? event.touches[0].clientY : event.clientY;		
	var parent=event.target.getBoundingClientRect();
	painter.end.x=Math.floor(((x-parent.left)*this.width)/parent.width);
	painter.end.y=Math.floor(((y-parent.top)*this.height)/parent.height);
	draw(painter.init.x,painter.init.y,painter.end.x,painter.end.y,_CONFIG.draw.color,_CONFIG.draw.line);
	JVision.Render();
	painter.init.x=painter.end.x;
	painter.init.y=painter.end.y;
}
function initClear(event:Touch.EventMouse){
		this.addEventListener("mousemove",moveClear); 
  		this.addEventListener("touchmove",moveClear);		
	}
	function endClear(event:Touch.EventMouse){
		this.removeEventListener("mousemove",moveClear); 
  		this.removeEventListener("touchmove",moveClear);
	}
	function moveClear(event:Touch.EventMouse){
		var x=(event.touches!=undefined)? event.touches[0].clientX : event.clientX,y=(event.touches!=undefined)? event.touches[0].clientY : event.clientY;		
		var parent=event.target.getBoundingClientRect();
		painter.init.x=Math.floor(((x-parent.left)*this.width)/parent.width);
		painter.init.y=Math.floor(((y-parent.top)*this.height)/parent.height);
		clear(painter.init.x,painter.init.y,_CONFIG.draw.line);
		JVision.Render();
	}