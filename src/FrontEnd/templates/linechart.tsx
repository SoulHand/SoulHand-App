import * as React from 'react';
import Highcharts from 'highcharts/highcharts';
class LineChart extends React.Component <{},{}> {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        modules: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.array
        ]),
        container: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.object,
            PropTypes.array,
        ]),
        options: PropTypes.oneOfType([
            PropTypes.object,
            PropTypes.array
        ]),
    };

    highchartsModules() {
        if (this.props.modules) {
            this.props.modules.forEach(function(module) {
                module(Highcharts);
            });
        }
    }

    componentDidMount() {

        const inComing = [];
        const outGoing = [];
        const xAxisData = [];

        request.get('/dashboard/hourly', {
            params: {
                timezone: moment().utcOffset(),
                date:     '2016-07-06'
                // date:     moment(new Date()).format('YYYY-DD-MM')
            }
        }).then(response => {
                response.data.forEach(item => {
                    const flattened = {};
                    const out = {};
                    flattened.name = item.date;
                    flattened.y = item.inCount;
                    out.name = item.date;
                    out.y = item.outCount;
                    xAxisData.push(item.hour);
                    inComing.push(flattened);
                    outGoing.push(flattened);
                });
            });

            console.log('InComing data: ', inComing);
            console.log('OutGoing data: ', outGoing);
            console.log('X Axis data: ', xAxisData);

            const chartOptions = {
                tooltip: {
                    borderRadius:    20,
                    backgroundColor: 'rgba(18, 21, 23, 0.9)',
                    style:           {
                        color: 'white',
                    },
                    shadow: false,
                },
                title: {
                    text: ''
                },
                subTitle: {
                    text: ''
                },
                xAxis: {
                    categories: xAxisData,
                    labels:     {
                        enabled: false
                    },
                    crosshair: {
                        width:     1,
                        dashStyle: 'Dash',
                        color:     'black',
                        snap:      false,
                    },
                    tickInterval: 2
                },
                legend: {
                    enabled: false,
                },
                series: [{
                    name: 'Incoming Calls',
                    data: inComing
                }, {
                    name: 'Outgoing Calls',
                    data: outGoing
                }
            ]
        };

        this.highchartsModules();
        console.log('CHART OPTIONS: ', chartOptions);
        if (typeof window !== 'undefined') {
            this.chart = new Highcharts['Chart'](
                this.props.container,
                chartOptions
            );
        }
    }

    render() {
        const { container } = this.props;
        return (
            // <div styleName="chart">
                <div class="chart" id={container} />
            // </div>
        );
    }
}

export default LineChart;