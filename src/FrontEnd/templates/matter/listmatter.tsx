import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./item"
//import * as settings from "../settings"

export class ListMatter extends React.Component<{}, states.MatterList> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public matter:Array<crud.courses>=[];
	state:states.MatterList ={
		matters:[]
	};
	constructor(props:{}) {
		super(props);
			let str: string=localStorage.getItem("session");
	    	if(str){
					let session:users.sessions = JSON.parse(str);
		    	this.session=session;
	    	}
	}
	deleteField(event: any){
		var element:HTMLElement=event.target;
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/courses/${element.getAttribute("data-id")}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.matter=this.matter.filter(function(row){
							if(row._id==data._id){
								return false;
							}
							return true;
			    	});
			    	this.setState({
				      	matters : this.matter
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
              matters : filter
        });
    }
componentDidMount(){
        getJSON(`//0.0.0:8080/v1/courses/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
            this.matter= data;
            this.setState({
              matters: data
            });
        })
    }
    render () {
    return (
        <div className="container card">
            <form className="navbar-form navbar-right">
                <div className="right">
                    <input type="text" className="form-control" placeholder="Buscar" onChange={(e:any)=>{this.Filter(e)}}/>
                </div>
            </form>
            <h3>Materia</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                         <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.matters.map((row)=>{
                        return (
                            <tr key={row._id}>
                                <td>{row.name}</td>
                                <td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e:any)=>{this.deleteField(e)}}>Eliminar</button></td>
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
