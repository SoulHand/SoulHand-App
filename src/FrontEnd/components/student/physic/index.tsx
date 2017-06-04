import * as React from 'react'
import {ajax} from 'jquery'
import {Link, withRouter} from 'react-router'
import * as List from '../../profiles/student'
import {LineChart} from '../../linechart'
import * as Add from './create'

@withRouter
 export class Physic extends React.Component <Props.teacherView, {student: People.student, heights: Array<CRUD.height>, weights: Array<CRUD.weight>}>{
   public session: User.session;
   constructor(props:Props.teacherView){
     super(props)
     let str = localStorage.getItem("session");
     this.session = JSON.parse(str);
     this.state = {
       student: null,
       weights: [],
       heights: []
     };
   }
   componentDidUpdate(){
     componentHandler.upgradeAllRegistered();
   }
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: People.student)=>{
            this.props.router.replace('/students');
 	        }
 		});
   }
   componentDidMount(){
     let p1 = ajax({
       method:"GET",
       url: `${window._BASE}/v1/people/students/${this.props.routeParams.id}?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
       dataType: "json",
       data:null
     });
     let p2=ajax({
   			method:"GET",
   	        url: `${window._BASE}/v1/physic/static/height/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
   	        dataType: "json",
   	        data:null
   		}),
   		p3=ajax({
   			method:"GET",
   	        url: `${window._BASE}/v1/physic/static/weight/?PublicKeyId=${this.session.publicKeyId}&PrivateKeyId=${this.session.privateKeyId}`,
   	        dataType: "json",
   	        data:null
   		});
     window.Promise.all([p1.done(), p2.done(), p3.done()]).then((data: any) => {
       this.setState({
 		      student : data[0],
 		      weights: data[2],
 		      heights: data[1]
 		    });
     });
   }
   render(){
     let body = (
       <div className="mdl-grid mdl-color--white demo-content">
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
       </div>
     );
     if(this.state.student){
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
      				config1.xAxis.categories.push((date.getDate() + "th " + months[date.getMonth()]));
      				config2.xAxis.categories.push((date.getDate() + "th " + months[date.getMonth()]));
      				config1.series[0].data.push(row.weight);
      				var maxWeight:CRUD.weight;
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
      				var maxAge:CRUD.height;
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
       body = (
         <div className="demo-charts mdl-color--white mdl-shadow--2dp mdl-cell mdl-cell--12-col mdl-grid">
            <LineChart id="weightGrap" config={config1}/>
            <LineChart id="heightGrap" config={config2}/>
         </div>
       );
     }
     return(
       <div className="demo-layout mdl-layout mdl-js-layout mdl-layout--fixed-drawer mdl-layout--fixed-header">
       <header className="demo-header mdl-layout__header mdl-color--grey-100 mdl-color-text--grey-600">
        <div className="mdl-layout__drawer-button"><Link to={`/students/get/${this.props.routeParams.id}`}><i className="material-icons">&#xE5C4;</i></Link></div>
         <div className="mdl-layout__header-row">
           <span className="mdl-layout-title">SoulHand</span>
         </div>
       </header>
          <main className="mdl-layout__content mdl-color--white-100">
            {body}
            {this.state.student && (
              <table className="mdl-data-table mdl-js-data-table resize">
                <thead>
                  <tr>
                    <th className="mdl-data-table__cell--non-numeric">Fecha</th>
                    <th>Edad</th>
                    <th>Peso</th>
                    <th>Estatura</th>
                  </tr>
                </thead>
                <tbody>
                {
                  this.state.student.physics.map((row) => {
                    let date = new Date(row.date);
                    return (
                      <tr key={row._id}>
                        <td className="mdl-data-table__cell--non-numeric"><span>{date.toLocaleString()}</span></td>
                        <td className="mdl-data-table__cell">{row.age}</td>
                        <td className="mdl-data-table__cell">{row.weight}</td>
                        <td className="mdl-data-table__cell">{row.height}</td>
                      </tr>
                    );
                  })
                }
                </tbody>
              </table>
            )}
            <Link to={`/students/get/${this.props.routeParams.id}/physic/create`} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--fab mdl-color--accent mdl-color-text--accent-contrast fixed"><i className="mdl-color-text--white-400 material-icons" role="presentation">add</i></Link>
          </main>
       </div>
     );
   }
 }

export let Create = Add.Create;


/*
<div className="mdl-layout-spacer"></div>
{this.state.student && (
  <button className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--icon" id="hdrbtn">
    <i className="material-icons">more_vert</i>
  </button>
)}
<ul className="mdl-menu mdl-js-menu mdl-js-ripple-effect mdl-menu--bottom-right" htmlFor="hdrbtn">
  <li className="mdl-menu__item"><Link to={`/students/get/${this.props.routeParams.id}`}>Eliminar</Link></li>
</ul>

*/
