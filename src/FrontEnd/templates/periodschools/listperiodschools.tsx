import * as React from 'react';
import {getJSON,ajax} from 'jquery'
import {Item} from "./Item"
//import * as settings from "../settings"

export class ListPeriodSchools extends React.Component<{}, {}> {
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public session:users.sessions;
	public periodschools:any=[];
	state={
		periodschools:[],
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
	        url: `//localhost:8080/v1/periods/${element.dataset.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:periodschools)=>{
	        	this.periodschools=this.periodschools.filter(function(row:periodschools){
					if(row._id==data._id){
						return false;
					}
					return true;
		    	});
		    	this.setState({
			      	periodschools : this.periodschools
			    });
	        }
		});
	}
    Filter(event:any){
        var filter=this.periodschools.filter((row)=>{
            var exp=new RegExp(event.target.value,"i");
            if(exp.test(row.name)==true){
                return true;
            }
            return false;
        });
        this.setState({
              periodschools : filter
        });
    }
	
	Xiu, [31.03.17 20:44]
componentDidMount(){
        getJSON(`//0.0.0:8080/v1/periods/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,(data)=>{
            this.periodschools= data;
            this.setState({
              periodschools: data
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
                <span>{this.state.search}</span>
            </form>
            <h3>Periodo Escolar</h3>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Nombre</th>
                         <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.state.periodschools.map((row:any)=>{
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