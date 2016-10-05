declare namespace MousePoint{
	interface Point{
		init?:MousePoint.coords
		center?:MousePoint.coords
		end?:MousePoint.coords
		distance?:MousePoint.distance		
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

let parent:HTMLElement, docks:Array<any>,mouse:MousePoint.Point;

let move=(event:Touch.EventMouse)=>{
	mouse.end.x=mouse.init.x=(event.touches!=undefined)? event.touches[0].clientX : event.clientX;
	mouse.end.y=mouse.init.y=(event.touches!=undefined)? event.touches[0].clientY : event.clientY;
	parent.addEventListener("mousemove",moveend);
	parent.addEventListener("touchmove",moveend);
}
let moveend=(event:Touch.EventMouse)=>{
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