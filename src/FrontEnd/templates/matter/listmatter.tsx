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
		matter:[],
		search:""
	};
	
	constructor(props:any) {
		super(props);
    	let str=localStorage.getItem("session");
    	let session=JSON.parse(str);
		this.session=session;		
	}
	deleteField(data: any){
		var element:EventTarget=event.target;		
		ajax({
			method:"DELETE",
	        url: `//localhost:8080/v1/courser/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.teachers=this.matter.filter(function(row:peoples.teachers){
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
	
	Xiu, [31.03.17 20:44]
componentDidMount(){
        getJSON(`//0.0.0:8080/v1/courser/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
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
                    <input type="text" className="form-control" placeholder="Buscar"/>
                </div>
                <span>{this.state.search}</span>
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
                                <td><button type="button" className="btn btn-warning">Editar</button>
                                <button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
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