import * as React from 'react'
import {Link} from 'react-router'

export class FormUtils<P, S> extends React.Component<P, S> {
  public session: User.session;
  public fields:compat.Map = {};
  constructor(props: P) {
    super(props);
    let str = localStorage.getItem("session");
    this.session = JSON.parse(str);
  }
  public getFields(event:any){
    this.fields[event.target.id].value = event.target.value;
  }
  public validate(str: string, key:string){
    if((this.fields[key].require && !this.fields[key].value)
       || (this.fields[key].match
            && !this.fields[key].match(this.fields[key].value))){
        return false;
      //throw new KeyError(key, this.fields[key].error);
    }
    return true;
  }
}

class KeyError extends Error {
  public key: string;
  constructor(key:string, message:string){
    super(message);
    this.key = key;
  }
}
