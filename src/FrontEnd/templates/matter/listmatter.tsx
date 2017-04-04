import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./item"
//import * as settings from "../settings"

export class ListMatter extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public matter:any=[];
	state={
		matter:[]
	};
	
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	deleteField(event: any){
		var element:EventTarget=event.target;		
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/courses/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.matter=this.matter.filter(function(row:peoples.teachers){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	matter : this.matter
			    });
	        }
		});
	}
    Filter(event:any){
        var filter=this.matter.filter((row)=>{
            var exp=new RegExp(event.target.value,"i");
            if(exp.test(row.name)==true){
                return true;
            }
            return false;
        });
        this.setState({
              matter : filter
        });
    }
componentDidMount(){
        getJSON(`//0.0.0:8080/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
            this.matter= data;
            this.setState({
              matter: data
            });
        })
    }
    render () {
    return (
        <div className="container card">
            <form className="navbar-form navbar-right">
                <div className="right">
                    <input type="text" className="form-control" placeholder="Buscar" onChange={(e)=>{this.Filter(e)}}/>
                </div>
            </form>
            <h3>Grado</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                         <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.matter.map((row:any)=>{
                        return (
                            <tr key={row._id}>
                                <td>{row.name}</td>
                                <td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
                            </tr>
                        );
                    })
                }
                </tbody>
            </table>
        </div>
    );
  }
}