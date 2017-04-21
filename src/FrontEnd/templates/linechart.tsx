import * as React from 'react'
import * as Highcharts from 'highcharts/highcharts'

export class LineChart extends React.Component <Props.LineChart,{}>{
	public chart:any;
	componentDidMount() {
		this.chart = new Highcharts.Chart(this.props.id,this.props.config);
	}
	/*componentWillReceiveProps(props) {
		//console.log(props);
	  	//this.chart.highcharts().series[0].setData(props.data);
	}*/
	render() {
		let flex = {
		  display:"block",
		  width:"100%"
		}
	  return (
	    <div id={this.props.id} style={flex}>
	    </div>
	  )
	}
}
