import * as React from 'react';
import {ajax} from 'jquery'
import 'string-validator'
import {withRouter, Link} from 'react-router';
import {TableCognitionsAdd} from '../tablecognitionsadd';

@withRouter
export class Step5 extends React.Component<Props.GenericRouter, states.SetCognitions> {
	public session:users.sessions;
  public state:states.SetCognitions={
    error:{
			server:null,
			name:null,
			description:null
		},
		cognitions:[]
  }
	public fields:compat.Map={
		name:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		},
		description:{
			match:(fn:string)=>{
				return !validator.isNull()(fn);
			},
			value:null,
			required:true
		}
	};
	constructor(props:Props.GenericRouter) {
			super(props);
			let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
	}
	public getFields(event:any){
		let fields:compat.Map=this.fields;
		fields[event.target.id].value=event.target.value;
	}
	public validate(){
		let fields:compat.Map=this.fields;
		var value=true;
		var state:compat.Map=this.state.error;
		var data:compat.Map={
			dni:null,
			name:null,
			phone:null,
			email:null,
			birthdate:null
		};
		for (var i in fields){
			if( (fields[i].require && !fields[i].value) || (fields[i].match && !fields[i].match(fields[i].value))){
				value=false;
				state[i]=true;
				continue;
			}
				data[i]=fields[i].value;
				state[i]=false;
		}
		state.server=null;
		if(!value){
			this.setState({
				error:state
			});
			return false;
		}
		return data;
	}
	componentDidMount(){
		ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/objetives/${this.props.routeParams.objetive}/cognitions?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        success:(data:Array<crud.cognition>)=>{
				    this.setState({
				      cognitions : data
				    });
	        }
		});
	}
	delete(id:string){
			this.state.cognitions=this.state.cognitions.filter((row)=>{
				if(row._id==id){
					return false;
				}
				return true;
	    });
	  	this.setState({
	      	cognitions : this.state.cognitions
	    });
	}
	render () {
    return (
			<div className="card card-container" style={{marginTop:"5px"}}>
				<TableCognitionsAdd domain={this.props.routeParams.domain} level={this.props.routeParams.level} objetive={this.props.routeParams.objetive} cognitions={this.state.cognitions} session={this.session} callback={this.delete.bind(this)}/>
			</div>
    );
  }
}
