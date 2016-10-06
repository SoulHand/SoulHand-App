interface Window {
  _BASE ?: string
}
interface EventListener {
  handleEvent(evt: Event): void;
}

type _CONFIG=Object;

interface EventTarget {
    removeEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    addEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    dispatchEvent(evt: Event): boolean;
}
interface EventListener{
    removeEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    addEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    dispatchEvent(evt: Event): boolean;
}


/*        JVision      */
declare namespace JVision{
  type input = HTMLVideoElement | HTMLImageElement;
  type ouput = CanvasRenderingContext2D;
  type objects=Array<any>;
  function init(video: HTMLVideoElement | HTMLImageElement, canvas:CanvasRenderingContext2D,callback?:Function|void): void | CanvasRenderingContext2D;
  function render(event:any|void): void;
  function capture(): ImageData;
  function classifyPyramid(src:ImageData,step:number,Wmin:number,Hmin:number): ImageData;
  function getWindows(src:ImageData,WC:number,HC:number,step:number): ImageData;
}


/*interface JVsion{
  input:HTMLVideoElement,
  ouput:any,
  init:Function,
  render:Function,
  Capture:Function,
  classifyPyramid:Function,
  getWindows:Function
}*/