import * as React from 'react'
import {Chart} from 'highcharts'

export class LineChart extends React.Component <Props.LineChart,{}>{
	public chart:any;
	componentDidMount() {
		this.chart = new Chart(this.props.id,this.props.config);
	}
	/*componentWillReceiveProps(props) {
		//console.log(props);
	  	//this.chart.highcharts().series[0].setData(props.data);
	}*/
	render() {
		let flex: any = {
		  display:"block",
		};
		if(this.props.autoSize != false){
			flex.width = "100%";
		}
	  return (
	    <div id={this.props.id} style={flex} className={this.props.className}>
	    </div>
	  )
	}
}
