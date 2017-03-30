import * as React from 'react';
import * as validator from 'string-validator';
import {withRouter} from 'react-router';

@withRouter
export class FormValidate extends React.Component<{}, {}> {
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:any;
	getInitialState(){
		return {
			error:{}
		}
	}
	constructor(props:any) {
		super(props);
    	let session=localStorage.getItem("session");
		this.state = {teachers:[],search:""};
    	session=JSON.parse(session);
		this.session=session;		
	}
	getFields(event:any){
		this.fields[event.target.id].value=event.target.value;
	}
	getRadioButton(event:any){
		this.fields["interprete"].value= (event.target.id=="yes") ? true : undefined
		this.setState({
			radio:event.target.id
		});
	}
	validate(){
		var value=true;
		var state=this.state.error;
		var data={};
		for (var i in this.fields){
			if( (this.fields[i].require && !this.fields[i].value) || (this.fields[i].match && !this.fields[i].match(this.fields[i].value))){
				value=false;
				state[i]=true;
				continue;
			}
				data[i]=this.fields[i].value;
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
}