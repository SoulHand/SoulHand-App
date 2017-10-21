import * as React from 'react'
import {Chart} from 'highcharts'

export class LineChart extends React.Component <Props.LineChart,{}>{
	public chart:Highcharts.ChartObject;
	componentDidMount() {
		this.chart = new Chart(this.props.id,this.props.config);
	}
	componentWillReceiveProps(props: Props.LineChart) {
		this.chart.options = props.config;
		this.chart.redraw();
	}
	render() {
		let flex: any = {
		  display:"block",
		};
		if(this.props.autoSize != false){
			flex.width = "100%";
		}
	  return (
	    <div id={this.props.id} style={flex} className={this.props.className} title={this.props.title}>
	    </div>
	  )
	}
}
