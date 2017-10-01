import * as React from 'react'


interface Bar {
	width: string | number
	title?: string
}

export class ProgressBar extends React.Component <Bar,{}>{

	render() {
		var width: any = this.props.width;
		var widthN = parseFloat(width);
		var className = "mdl-color--red";
		if(typeof width == "number"){
			width = width + "%";
		}
		if (widthN >= 50 && widthN <= 60){
			className = "mdl-color--orange";
		}
		if (widthN > 60 ){
			className = "mdl-color--green-A400";
		}
	  return (
			<div style={{ width: "100%" }} className="mdl-progress mdl-js-progress" title={this.props.title}>
				<div className={`progressbar bar bar1 ${className}`} style={{ width: width }}></div>
			</div>
	  )
	}
}
