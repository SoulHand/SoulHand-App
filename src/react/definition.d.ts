interface Window {
  _BASE ?: string
}
interface EventListener {
  handleEvent(evt: Event): void;
}
interface EventTarget {
    removeEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    addEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    dispatchEvent(evt: Event): boolean;
}
interface EventListenerObject {
    removeEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    addEventListener(type: string, listener: Function|EventListener, useCapture?: boolean): void;
    dispatchEvent(evt: Event): boolean;
}