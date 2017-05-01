import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter,Link} from 'react-router';

@withRouter
export class Silen extends React.Component<Props.StudentCreate, {error:any,radio:any,question:{name:string,description:string}}>{
	public session:users.sessions;
	public audition:Array<number>=[];
  public questions=[
    {
      name:"¿Escucha conversaciones?",
      description:"El alumno es capaz de escuchar conversaciones en tono de voz promedio sin inconvenientes"
    },
    {
      name:"¿Reacciona a cantos y bailes?",
      description:"Los cantos y bailes, instrumentos músicales"
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
      if(this.audition[5]!=undefined){
        this.props.router.replace(`/students/get/${this.props.routeParams.id}/physic/sound/asistent/step5`);
      }
    }
	}
  calValue(num:number){
      if(!this.audition[4]){
        this.audition[4]=0;
      }
      this.audition[4]+=(num/this.n);
      let aud=this.questions.shift();
        this.setState({
          question:aud,
          radio:null
        });
  }
  completed(){
		console.log(this);
    this.audition[4]*=10;
    ajax({
			    method:"PUT",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}/sound/test?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:{value:JSON.stringify(this.audition)},
	        success:(data:any)=>{
            sessionStorage.removeItem("audition-test");
            this.props.router.replace(`/students/get/${this.props.routeParams.id}`);
	        },
          error:(data:any)=>{
          	var state=this.state.error;
          	state.server=data.responseJSON;
          	this.setState({
          		error:state
          	});
          }
		});
  }
	render () {
    if(this.state.question){
      return (
        <div className="card card-container" style={{marginTop:"5px"}}>
          <h1>Sonidos silenciosos</h1>
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
        <h1>Sonidos silenciosos</h1>
        <p>Ya ha sido evaluado aparatos electricos, presione continuar para seguir la evaluación</p>
        <button className="button btn-success" onClick={this.completed.bind(this)}>Finalizar</button>
      </div>
    );
  }
}
