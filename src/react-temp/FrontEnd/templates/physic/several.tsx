import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter,Link} from 'react-router';

@withRouter
export class Several extends React.Component<Props.StudentCreate, {error:any,radio:any,question:{name:string,description:string}}>{
	public session:users.sessions;
	public audition:Array<number>=[];
  public questions=[
    {
      name:"¿Reacciona al tono de un celular?",
      description:"¿Haz observado en algun momento reaccionar al alumno involuntariamente cuando suena un celular o telefóno?, estos movimientos involuntarios pueden ser producto de un estimulo al sonido producido"
    },
    {
      name:"¿Reacciona al sonido de herramientas electricas?",
      description:"Una aspiradora, sacapuntas electrico, una podadora o cualquier instrumento electrico que emita un sonido, puede atraer a ciertos niños de su aula"
    }
  ];
	public n:number=this.questions.length;
	public fields:compat.Map={
		weight:{
			match:validator.isFloat(),
			value:null,
			required:true
		},
		height:{
			match:validator.isFloat(),
			value:null,
			required:true
		}
	};
	state:{error:any,radio:any,question:{name:string,description:string}}={
		error:{
			name:false,
			server:null
		},
		radio:null,
    question:this.questions.shift()
	};
	constructor(props:Props.StudentCreate) {
		super(props);
		let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
    let str2:string = sessionStorage.getItem("audition-test");
    if(str2){
      let audition:Array<number> = JSON.parse(str2);
      this.audition=audition;
      if(this.audition[1]!=undefined){
        this.props.router.replace(`/students/get/${this.props.routeParams.id}/physic/sound/asistent/step3`);
      }
    }
	}
  calValue(num:number){
      if(!this.audition[0]){
        this.audition[0]=0;
      }
      this.audition[0]+=(num/this.n);
      let aud=this.questions.shift();
        this.setState({
          question:aud,
          radio:null
        });
  }
  completed(){
		console.log(this.audition);
    this.audition[0]*=10;
    this.audition[1]=0;
    sessionStorage.setItem("audition-test",JSON.stringify(this.audition));
    this.props.router.replace(`/students/get/${this.props.routeParams.id}/physic/sound/asistent/step3`);
  }
	render () {
    if(this.state.question){
      return (
        <div className="card card-container" style={{marginTop:"5px"}}>
          <h1>Aparatos electricos</h1>
          <p>En esta etapa nos enfocaremos en observar aparatos electricos y como reacciona el alumno ante ciertos sonidos</p>
          <h2>{this.state.question.name}</h2>
          <p className="text-align justify">{this.state.question.description}</p>
          <div className="form-check">
          <label className="form-check-label">
          <input type="radio" className="form-check-input" name="interprete" id="yes" value="option1" checked={this.state.radio==true} onChange={(e:any)=>{this.calValue(1)}}/>
          Si
          </label>
          </div><div className="form-check">
          <label className="form-check-label">
          <input type="radio" className="form-check-input" name="interprete" id="yes" value="option1" checked={this.state.radio==false} onChange={(e:any)=>{this.calValue(0)}}/>
          No
          </label>
          </div>
          <button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
        </div>
      );
    }
    return (
      <div className="card card-container" style={{marginTop:"5px"}}>
        <h1>Aparatos electricos</h1>
        <p>Ya ha sido evaluado aparatos electricos, presione continuar para seguir la evaluación</p>
        <button className="button btn-success" onClick={this.completed.bind(this)}>Continuar</button>
      </div>
    );
  }
}
