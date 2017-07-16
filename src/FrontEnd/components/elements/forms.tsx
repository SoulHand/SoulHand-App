import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {ajax} from 'jquery'

declare namespace forms{
  interface input{
    label: string
    placeholder?: string
    value?: string
    title?: string
    pattern ?: Function | RegExp
    required ?: boolean
    children ?: any
    id: string
    type?: string
    error: string
    onChange ?: any
  }
  interface form {
    method: string
    action: string
    children?: any
    onLoad: any
    disabled?: boolean
    onSubmit?: any
    title ?: string
    id?: string
    onError: any
    onReset?: any
    label ?: string
  }
}

class ValidateElement extends React.Component<forms.input, {isValid: boolean}>{
  public value: string = "";
  public pattern: RegExp | Function;
  public DOM: any;
  public input: any;
  public icon: any;
  constructor(props: forms.input){
    super(props);
    this.pattern = this.props.pattern;
  }
  getFields(event: React.FormEvent<HTMLInputElement>){
    var element: any = event.target;
    this.value = element.value;
    this.validate();
    if(this.props.onChange){
      this.props.onChange(this.value, element.id);
    }
  }
  forceError(){
    this.DOM.classList.add("is-invalid");
    //this.DOM.className = "form-group has-error";
    //this.icon.innerHTML = '<i class="fa fa-warning"></i>';
    //this._setMessage();
  }
  /*protected _setMessage(){
    var node = document.createElement("em");
    node.className = "state-error";
    node.setAttribute("for", this.props.id);
    node.innerHTML= this.props.error;
    this.DOM.append(node);
  }*/
  reset(){
    this.value = this.input.value = "";
    this.forceNull();
  }
  forceSuccess(){
    console.log(this.DOM.classList);
    this.DOM.classList.remove("is-invalid");
    //this.DOM.className = "form-group has-success";
    //this.icon.innerHTML = '<i class="fa fa-check"></i>';
  }
  forceNull(){
    this.DOM.classList.remove("is-invalid");
  }
  componentDidMount(){
    this.DOM = ReactDOM.findDOMNode(this);
    this.input = this.DOM.querySelector(`#${this.props.id}`);
    this.icon = this.DOM.querySelector(`span[data-icon]`);
    this.mountConfig(this.props);
    this.input.addEventListener("reset", (event: any) => {
      this.forceNull();
      this.value = "";
      this.input.setAttribute("data-valid", !this.props.required);
      var e = new CustomEvent("valid-state-change");
      this.input.dispatchEvent(e);
    });
    this.componentDate();
  }
  componentDate(){
    if(this.input.type != "date" && this.props.type == "date"){
      console.log("modo incompatible!");
      /*this.input.setAttribute("data-date-format", 'yyyy-mm-dd');
      var date: any = $(this.input).datepicker({
        dateFormat: "yy-mm-dd",
        changeMonth: true,
        changeYear: true
      });
      date.bind("change", (event: any) => {
        this.getFields(event);
      });*/
    }
  }
  componentWillReceiveProps(prevProps:forms.input, prevState:{}){
    this.mountConfig(prevProps);
  }
  validate(){
    var valid = (this.props.required == true && !this.value)
    || (typeof this.pattern == "function" && !this.pattern(this.value))
    || (typeof this.pattern == "object" && !this.pattern.test(this.value));
    if(this.props.required == true || this.value!= ""){
      if(valid){
        this.forceError();
      }else if(!(this.props.required == false && !this.value)){
        this.forceSuccess();
      }
    }else{
      this.forceNull();
    }
    this.input.setAttribute("data-valid", !valid || (!this.props.required
      && !this.value));
    var event = new CustomEvent("valid-state-change");
    this.input.dispatchEvent(event);
  }
  mountConfig(props: forms.input){
    if(props.value){
      this.value = this.input.value = props.value;
      this.validate();
    }else{
      this.input.setAttribute("data-valid", !this.props.required);
      var event = new CustomEvent("valid-state-change");
      this.input.dispatchEvent(event);
    }
  }
  componentDidUpdate(){
    this.componentDate();
  }
}

export class Input extends ValidateElement{
  render(){
    return (
      <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label ">
       <input className="mdl-textfield__input" type={this.props.type} id={this.props.id} placeholder={this.props.placeholder}  onChange={this.getFields.bind(this)} required={this.props.required}/>
       <label className="mdl-textfield__label" htmlFor={this.props.id}>{this.props.label}{this.props.required == true && (
         <span style={{color: "#e9573f"}}>*</span>
       )}</label>
       <span className="mdl-textfield__error">Es necesaria un nombre valido</span>
     </div>
    );
  }
}

export class Form extends React.Component<forms.form,{}> {
  public fields: Array<any> = [];
  protected submit: any;
  protected DOM: any;
  protected validates: compat.Map = {};
  send(event: React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    var p1 = ajax({
      method: this.props.method,
      url: this.props.action,
      dataType: "json",
      data:$(event.target).serialize()
    });
    p1.done((data: any) => {
      
      this.props.onLoad(data);
    }).fail(this.props.onError);
  }
  getFields(childrens: Array<any>){
    var p1 = new window.Promise((resolve: any, reject: any) => {
      for(var i=0, n= childrens.length; i<n; i++){
        if(typeof(childrens[i]) != "object"){
          continue;
        }
        if(childrens[i].props && childrens[i].props.children){
          this.getFields(childrens[i].props.children)
        }
        if(childrens[i].type && childrens[i].type.__proto__ === ValidateElement){
          var element = ReactDOM.findDOMNode(this).querySelector(`#${childrens[i].props.id}`);
          element.addEventListener("valid-state-change", (event: any) => {
            this.block(event.target);
          });
          var validate = element.getAttribute("data-valid") == "true";
          this.validates[element.id] = validate;
          this.fields.push(element);
        }
      }
      resolve(element);
    });
    return p1;
  }
  componentDidUpdate(){
    this.fields=[];
    this.getFields(this.props.children).then(this.block.bind(this));
  }
  componentDidMount(){
    this.DOM = ReactDOM.findDOMNode(this);
    this.submit = this.DOM.querySelector("button[type='submit']");
    this.getFields(this.props.children).then(this.block.bind(this));
    this.DOM.addEventListener("reset", () => {
      var event = new CustomEvent("reset");
      this.fields.forEach((field: any) => {
        field.dispatchEvent(event);
      });
    });
  }
  protected block(element: any){
    if(element){
      var validate = element.getAttribute("data-valid") == "true";
      this.validates[element.id] = validate;
      var p1 = new window.Promise((resolve:any, reject:any) => {
        var disable = false;
        for(var i in this.validates){
          disable = disable || !this.validates[i];
        }
        resolve(disable);
      });
      p1.then((value: boolean) => {
        this.submit.disabled = value;
      });
    }
  }
  render(){
    var submit = (this.props.onSubmit) ? this.props.onSubmit.bind(this) : this.send.bind(this);
    var value = (this.props.label) ? this.props.label : "Registrar";
    return(
      <form method={this.props.method} action={this.props.action} onSubmit={submit} role="form" className="form-horizontal text-left">
        {this.props.children}
        <button type="submit" className="btn btn-primary">{value}</button>
        <button type="reset" className="btn btn-primary" onClick={this.props.onReset}>Cancelar</button>
      </form>
    );
  }
}
