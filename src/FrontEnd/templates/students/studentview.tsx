import * as React from 'react';
import {Link} from 'react-router'
import {ajax} from 'jquery'
import {LineChart} from '../linechart'

export class StudentView extends React.Component<Props.StudentView, states.StudentView>{
	public session:users.sessions;
	public PrivateKeyId:string;
	public PublicKeyId:string;
	public fields:compat.Map={};
	state:states.StudentView = {
		student:null,
		error:null,
		grades:[],
		weights:null,
		heights:null
	};
	constructor(props:Props.StudentView) {
		super(props);
		let str: string=localStorage.getItem("session");
    	if(str){
				let session:users.sessions = JSON.parse(str);
	    	this.session=session;
    	}
	}
	public getFields(event:any){
		var element=event.target.parentNode;
		this.fields[element.id]=event.target.innerText || event.target.textContent;
	}
	keycod(event:any){
		var element=event.target;
		if(event.keyCode==13){
			event.preventDefault();
			element.parentNode.children[2].children[0].click();
		}
	}
	componentDidMount(){
		var p1=	ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}),
		p2=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/grades/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}),
		p3=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/physic/static/height/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		}),
		p4=ajax({
			method:"GET",
	        url: `${window.settings.uri}/v1/physic/static/weight/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null
		});
		Promise.all([p1.done(),p2.done(),p3.done(),p4.done()]).then((data:any)=>{
			this.setState({
		      student : data[0],
		      grades: data[1],
		      weights: data[3],
		      heights: data[2]
		    });
		    //students.profile
		});
	}
	edit(event:any){
		var element=event.target;
		var parent=element.parentNode.parentNode;
		if(element.dataset.save=="false"){
			element.className="button circle icons x16 check white";
			parent.children[1].contentEditable=true;
			element.setAttribute("data-save","true");
			return;
		}
		var data:compat.Map={};
		data[parent.id]=this.fields[parent.id];
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:peoples.students)=>{
						element.className="button circle icons x16 edit white";
	        	parent.children[1].contentEditable=false;
						element.setAttribute("data-save","false");
	        	this.setState({
							student:data
						});
	        },
	        error:(data:any)=>{
	        	this.setState({
							error:data.responseJSON.message
						});
	        }
		});
	}
	changeGrade(event:any){
		var data={
			grade:event.target.value
		}
		ajax({
			method:"PUT",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:data,
	        success:(data:peoples.students)=>{
	        	this.setState({
							student:data
						});
	        },
	        error:(data:any)=>{
	        	this.setState({
					error:data.responseJSON.message
				});
	        }
		});
	}
	deleteField(event: any){
		var element:HTMLElement=event.target;
		ajax({
			method:"DELETE",
	        url: `${window.settings.uri}/v1/people/students/${this.props.routeParams.id}/physic/${element.getAttribute("data-id")}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
	        dataType: "json",
	        data:null,
	        crossDomain:true,
	        success:(data:peoples.teachers)=>{
		    	this.setState({
					student:data
				});
	        }
		});
	}
	render () {
		if(!this.state.student){
			return (
    			<div className="container">
    			{this.state.error && (
					<div className="alert alert-danger" role="alert">
					  {this.state.error}
					</div>
				)}
    				<div className="loadding"></div>
    			</div>
			);
		}
		let styleflex={
			flex:"1 1 50%"
		};
		var valid: Array<ValidInput>=[
			{
				name:"dni",
				label:"Documento de identidad",
				value:this.state.student.data.dni
			},
			{
				name:"name",
				label:"Nombre y Apellido",
				value:this.state.student.data.name
			},
			{
				name:"birthdate",
				label:"Fecha de nacimiento",
				value:this.state.student.data.birthdate
			}
		];
		let _switch: compat.Map=({
			TEACHER: "Docente",
			STUDENT:"Alumno",
			PARENT:"Representante"
		});
		var role=_switch[this.state.student.data.mode];
		var Items=valid.map((row)=>{
			return (
				<div className="item" key={row.name} id={row.name}>
					<div className="field">
						<b>{row.label}:</b>
					</div>
					<div className="value" onKeyUp={(e)=>{this.getFields(e)}} onKeyDown={(e)=>{this.keycod(e)}}>
						{row.value}
					</div>
					<div className="toolbox">
						<button className="button circle icons x16 edit white" data-save={false} title="Editar campo" onClick={(e)=>{this.edit(e)}}></button>
					</div>
				</div>
			);
		});
		var config1:any={
			title:{
				text:"Indice mensual de peso",
				x:-20
			},
			xAxis:{
				categories:[],
				title:{
					text:"meses del año"
				}
			},
			yAxis:{
				title:{
					text:"kg"
				}
			},
			series: [
				{
					name:"Peso actual",
					data: []
				},
				{
					name:"Peso minimo",
					data: []
				},
				{
					name:"Peso máximo",
					data: []
				}
			]
		}, config2:any={
			title:{
				text:"Indice mensual de altura",
				x:-20
			},
			xAxis:{
				categories:[],
				title:{
					text:"meses del año"
				}
			},
			yAxis:{
				title:{
					text:"cm"
				}
			},
			series: [
				{
					name:"Altura actual",
					data: []
				},
				{
					name:"Altura mínima",
					data: []
				},
				{
					name:"Altura máxima",
					data: []
				}
			]
		};
		var today=new Date();
		var months:Array<string>=[
			"Enero",
			"Febrero",
			"Marzo",
			"Abril",
			"Mayo",
			"Junio",
			"Julio",
			"Agosto",
			"Septiembre",
			"Octubre",
			"Noviembre",
			"Diciembre"
		];
		this.state.student.physics.forEach((row)=>{
			var date=new Date(row.date);
			if(today.getFullYear()==date.getFullYear()){
				config1.xAxis.categories.push(months[date.getMonth()]);
				config2.xAxis.categories.push(months[date.getMonth()]);
				config1.series[0].data.push(row.weight);
				var maxWeight:crud.weights;
				this.state.weights.forEach((weight)=>{
					if(!maxWeight){
						maxWeight=weight;
					}
					if(Math.abs(maxWeight.height-row.height)>Math.abs(row.height-weight.height)){
						maxWeight=weight;
					}
				});
				config1.series[1].data.push(maxWeight.min);
				config1.series[2].data.push(maxWeight.max);
				config2.series[0].data.push(row.height);
				var maxAge:crud.heights;
				this.state.heights.forEach((height)=>{
					if(!maxAge){
						maxAge=height;
					}
					if(Math.abs(maxAge.age-row.age)>Math.abs(row.age-height.age)){
						maxAge=height;
					}
				});
				config2.series[1].data.push(maxAge.min);
				config2.series[2].data.push(maxAge.max);

			}
		});
    return (
    	<div className="container">
			{this.state.error && (
				<div className="alert alert-danger" role="alert">
				  {this.state.error}
				</div>
			)}
    		<div className="flex row">
				<div className="left_side">
					<img id="profile-img" className="rounded-circle" src="/images/user-login-icon-14.png" />
				</div>
			</div>
			<div className="fieldset v-align middle">
				{Items}
				<div className="item">
					<div className="field">
						<b>Escalar perdida de audición:</b>
					</div>
					<div className="value">
						<Link to={`/students/get/${this.props.routeParams.id}/physic/sound`}>
						{(this.state.student.discapacityLevel==0) ?
							"NO EVALUADA"
							:  (this.state.student.discapacityLevel>25 && this.state.student.discapacityLevel<=40) ?
								"LEVE"
							: (this.state.student.discapacityLevel>40 && this.state.student.discapacityLevel<=70) ?
								"MODERADA"
							: (this.state.student.discapacityLevel>70 && this.state.student.discapacityLevel<=90) ?
								"SEVERA"
							: (this.state.student.discapacityLevel>90 && this.state.student.discapacityLevel<=120) ?
								"PROFUNDA"
							:
								"SIN PERDIDA"
						}
						</Link>
					</div>
				</div>
				<div className="item">
					<div className="field">
						<b>Creado en:</b>
					</div>
					<div className="value">
						{this.state.student.data.createDate}
					</div>
				</div>
				<div className="item">
					<div className="field">
						<b>Grado:</b>
					</div>
					<div className="value">
						<select id="grade" onChange={(e)=>{this.changeGrade(e)}}>
							<option value="">Seleccione una opción</option>
							{
								this.state.grades.map((row)=>{
									var Option =(
										<option key={row._id} value={row._id}>{row.name}</option>
									);
									if(this.state.student.grade && row._id==this.state.student.grade._id){
										Option =(
											<option selected={true} key={row._id} value={row._id}>{row.name}</option>
										);
									}
									return Option;
								})
							}
						</select>
					</div>
				</div>
			</div>
			<h3 className="text-align center">Desarrollo físico</h3>
			<div className="flex row">
				<Link to={`/students/get/${this.props.routeParams.id}/physic/create`} className="button circle icons x16 add white"></Link>
			</div>
			<div className="flex row">
				<div className="text-align center" style={styleflex}>
					<LineChart config={config1} id="weight"></LineChart>
				</div>
				<div className="text-align center" style={styleflex}>
					<LineChart config={config2} id="height"></LineChart>
				</div>
			</div>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Fecha del registro</th>
						<th>Edad</th>
						<th>Peso</th>
                  		<th>Estatura</th>
                  		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.student.physics.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td>{row.date}</td>
								<td>{row.age}</td>
								<td>{row.weight} kg</td>
								<td>{row.height} cm</td>
								<td><button type="button" className="btn btn-danger" data-id={row._id} onClick={(e)=>{this.deleteField(e)}}>Eliminar</button></td>
							</tr>
						);
					})
				}
				</tbody>
			</table>
			<h3 className="text-align center">Historico de eventos</h3>
			<table className="table table-striped">
				<thead>
					<tr>
						<th>Fecha del registro</th>
                  		<th>Acción</th>
					</tr>
				</thead>
				<tbody>
				{
					this.state.student.history.map((row:any)=>{
						return (
							<tr key={row._id}>
								<td>{row.dateCreated}</td>
								<td>{row.description}</td>
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
