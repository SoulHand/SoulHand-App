import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter,Link} from 'react-router';

@withRouter
export class Trans extends React.Component<Props.StudentCreate, {error:any,radio:any,question:{name:string,description:string}}>{
	public session:users.sessions;
	public audition:Array<number>=[];
  public questions=[
    {
      name:"¿Reacciona ante ruidos urbanos?",
      description:"Es capaz de responder involuntariamente ante ciertos ruidos como el transito, sonidos de cornetas, autos entre otros."
    },
    {
      name:"¿Logra diferencias los ruidos urbanos?",
      description:"Es capaz de reconocer los ruidos e identificarlos"
    },
    {
      name:"¿Le molestan los ruidos de transito?",
      description:"Es comun que los ruidos del transito terrestre son molestos"
    }
  ];
	public n:number=this.questions.length;
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
      if(this.audition[2]!=undefined){
        this.props.router.replace(`/students/get/${this.props.routeParams.id}/physic/sound/asistent/step4`);
      }
    }
	}
  calValue(num:number){
      if(!this.audition[1]){
        this.audition[1]=0;
      }
      this.audition[1]+=(num/this.n);
      let aud=this.questions.shift();
        this.setState({
          question:aud,
          radio:null
        });
  }
  completed(){
    this.audition[1]*=10;
    this.audition[2]=0;
    sessionStorage.setItem("audition-test",JSON.stringify(this.audition));
    this.props.router.replace(`/students/get/${this.props.routeParams.id}/physic/sound/asistent/step4`);
  }
	render () {
    if(this.state.question){
      return (
        <div className="card card-container" style={{marginTop:"5px"}}>
          <h1>Transito urbano</h1>
          <p>En esta etapa nos enfocaremos en observar ruidos urbanos y las reacciones del alumno en cada uno de ellos, es necesario que observe el alumno mientras reproduzca sonidos de transporte urbano</p>
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
        <h1>Transito urbano</h1>
        <p>Ya ha sido evaluado transito urbano, presione continuar para seguir la evaluación</p>
        <button className="button btn-success" onClick={this.completed.bind(this)}>Continuar</button>
      </div>
    );
  }
}
