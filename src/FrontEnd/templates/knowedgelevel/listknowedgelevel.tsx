import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./Item"
//import * as settings from "../settings"

export class ListKnowledgeLevel extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public knowledgelevel:any=[];
	state={
		knowledgelevel:[],
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
	        url: `//localhost:8080/v1//${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
	        	this.teachers=this.knowledgelevel.filter(function(row:peoples.teachers){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	knowledgelevel : this.knowledgelevel
			    });
	        }
		});
	}
	
	Xiu, [31.03.17 20:44]
componentDidMount(){
        getJSON(`//0.0.0:8080/v1//?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
            this.knowledgelevel= data;
            this.setState({
              knowledgelevel: data
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
                        <th>Edad Minima</th>
                        <th>Edad Maxima</th>
                         <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.knowledgelevel.map((row:any)=>{
                        return (
                            <tr key={row._id}>
                                <td>{row.name}</td>
                                <td>{row.age min}</td>
                                <td>{row.age max}</td>
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