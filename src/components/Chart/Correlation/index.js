import BaseChart from "../BaseChart"

const _ = require("lodash")
let numeral = require("numeral")

function CorrelationChart(distribution, data, xAxisProp, yAxisProp, xAxisName, yAxisName, slope, y_intercept) {
    let chartName = "correlation-chart"
    _.assignIn(this, new BaseChart(chartName))
    this.distribution = distribution
    this.data = data
    this.xAxisProp = xAxisProp
    this.yAxisProp = yAxisProp
    this.xAxisName = xAxisName
    this.yAxisName = yAxisName
    this.slope = slope
    this.y_intercept = y_intercept
    this.prepareChartData()
}


CorrelationChart.prototype.prepareChartData = function() {
    let data = _.orderBy(this.data, [this.yAxisProp], "asc")

    let _points = []
    for (let i = 0; i < data.length; i++) {
        let x = data[i][this.xAxisProp]
        let y = data[i][this.yAxisProp]
        _points[i] = {x, y}
    }

    let _regression = []
    let firstPoint = _points[0].x
    let lastPoint = _points[_points.length - 1].x
    _regression[0] = this.getRegressionPoint(firstPoint, "first")
    _regression[1] = this.getRegressionPoint(lastPoint, "last")

    this.points = _points
    this.regress = _regression
}

CorrelationChart.prototype.getRegressionPoint = function(x, position) {
    let thisX = position === "first" ? _.floor(x, 0) : _.ceil(x, 0)
    return {
        x: thisX,
        y: (this.slope * thisX) + this.y_intercept
    }
}

CorrelationChart.prototype.getChartConfig = function() {
    return createChartConfig(
        this.distribution,
        this.xAxisName,
        this.yAxisName,
        this.points,
        this.regress
    )
}

function createChartConfig(distribution, xAxisName, yAxisName, points, regressionData) {
    let minPoints = _.minBy(regressionData, "x")
    let maxPoints = _.maxBy(regressionData, "x")
    let minX = minPoints.x
    let maxX = maxPoints.x

    let config = {
        type: "line",
        data: {
            datasets: [
                {
                    data: points,
                    showLine: false,
                    backgroundColor: BaseChart.pointBackgroundColor,
                    borderWidth: 0,
                    pointBorderWidth: BaseChart.pointBorderWidth,
                    pointBorderColor: BaseChart.pointBorderColor,
                    pointRadius: BaseChart.pointRadius,
                    pointHoverRadius: BaseChart.pointHoverRadius,
                    lineTension: 0,
                },
                {
                    data: regressionData,
                    showLine: true,
                    borderColor: "#00c853",
                    borderWidth: BaseChart.borderWidth,
                    pointRadius: 0,
                    pointBorderWidth: 0,
                    pointHitRadius: 0,
                    pointHoverRadius: 0,
                    lineTension: 0,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        id: "y-axis",
                        type: "linear",
                        scaleLabel: {
                            display: true,
                            labelString: yAxisName,
                        },
                        ticks: {
                            min: -4.0,
                            max: 4.0,
                        }
                    }
                ],
                xAxes: [
                    {
                        id: "x-axis",
                        type: "linear",
                        scaleLabel: {
                            display: true,
                            labelString: xAxisName,
                        },
                        ticks: {
                            min: minX,
                            max: maxX
                        }
                    }
                ]
            },
            tooltips: {
                mode: "index",
                intersect: false,
                position: "nearest",
                callbacks: {
                    title: function(tooltipItem, data) {
                        let value = tooltipItem[0].xLabel
                        return `x : ${numeral(value).format("0[.]000")}`
                    },
                    label: function(tooltipItem, data) {
                        if (tooltipItem.datasetIndex === 0) {
                            let value = tooltipItem.yLabel
                            return `y : ${numeral(value).format("0[.]000")}`
                        }
                    }
                }
            },
        }
    }

    return config
}

export {CorrelationChart}
