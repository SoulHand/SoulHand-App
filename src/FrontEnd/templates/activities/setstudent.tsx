import * as React from 'react';
import 'string-validator'
import {ajax} from 'jquery'
import {withRouter, Link} from 'react-router';
import {TableStudentAdd} from './tablestudentadd';


@withRouter
export class setStudent extends React.Component<Props.GenericRouter, {error:any, students:Array<peoples.students>}> {
	public session:users.sessions;
  public objetive:crud.objetive;
  public state:{error:any, students:Array<peoples.students>}={
    students:null,
    error:null
  }
	constructor(props:Props.GenericRouter) {
			super(props);
			let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
	}
	componentDidMount(){
		var p1=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/activities/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json"
		});
    p1.done().then((data:crud.activity)=>{
      let p2=ajax({
  			method:"GET",
  	        url: `${window.settings.uri}/v1/people/students/grade/${data.grade._id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
  	        dataType: "json"
  		});
      return p2.done();
    }).then((data:Array<peoples.students>)=>{
      this.setState({
        students:data
      });
    });
	}
	delete(id:string){
			this.state.students=this.state.students.filter((row)=>{
				if(row._id==id){
					return false;
				}
				return true;
	    });
	  	this.setState({
	      	students : this.state.students
	    });
	}
	render () {
    if(!this.state.students){
      return (
        <div className="card card-container" style={{marginTop:"5px"}}>
          {this.state.error && (
            <div className="alert alert-danger" role="alert">
              <strong>Error!</strong>{this.state.error}
            </div>
          )}
          <div className="loadding"></div>
        </div>
      );
    }
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<h1>Seleccione los alumnos</h1>
				<p>Seleccione los alumnos que participaran en esta actividad y cumpliran los objetivos asignados</p>
				<TableStudentAdd activity={this.props.routeParams.id} students={this.state.students} session={this.session} callback={this.delete.bind(this)}/>
				<button className="button btn-warning" onClick={(e:any)=>{window.history.back()}}>Volver</button>
				<Link to={`/teacher`} className="button btn-success">Finalizar</Link>
			</div>
    );
  }
}
