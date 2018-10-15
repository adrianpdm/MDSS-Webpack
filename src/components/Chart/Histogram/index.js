import BaseChart from "../BaseChart"

const _ = require("lodash")
const numeral = require("numeral")

function Histogram(data, xAxisName, yAxisName, unitFactor, numberFormat) {
    let chartName = "histogram"
    _.assignIn(this, new BaseChart(chartName))
    this.data = data.sort(function(a, b) {
        return a - b
    })
    this.xAxisName = xAxisName
    this.yAxisName = yAxisName
    this.unitFactor = unitFactor
    this.numberFormat = numberFormat
    this.prepareChartData()
}

Histogram.prototype.prepareChartData = function() {
    const self = this
    let precision = this.unitFactor.toString().split(".")
    let roundingUnit = precision[1] ? precision[1].length + 1 : 1

    let numOfClass = this.calculateClassNumber()
    let maxRange = _.round(_.max(this.data), roundingUnit - 1)
    let minRange = _.round(_.min(this.data), roundingUnit - 1)
    let range = _.round(maxRange, roundingUnit) - _.round(minRange, roundingUnit - 1)
    let interval = _.round(range / numOfClass, roundingUnit - 1)

    let classIntervals = []
    for (let i = 0; i < numOfClass; i++) {
        let lowerBound = i === 0
            ? minRange - (0.5 * this.unitFactor)
            : classIntervals[i - 1].upperBound
        let upperBound = i === numOfClass - 1
            ? maxRange + (0.5 * this.unitFactor)
            : lowerBound + interval

        let count = 0
        _.forEach(this.data, function(d) {
            if (_.inRange(d, lowerBound, upperBound)) {
                count += 1
            }
        })

        classIntervals[i] = {
            lowerBound,
            upperBound,
            count
        }
    }

    let intervals = _.map(classIntervals, function(interval) {
        let lowerBound = numeral(interval.lowerBound).format(self.numberFormat)
        let upperBound = numeral(interval.upperBound).format(self.numberFormat)
        return `${lowerBound} - ${upperBound}`
    })

    let values = _.map(classIntervals, function(interval) {
        return interval.count
    })

    this.intervals = intervals
    this.values = values
}

Histogram.prototype.calculateClassNumber = function() {
    return _.round(1 + (3.3 * Math.log10(this.data.length)), 0)
}

Histogram.prototype.getChartConfig = function() {
    return createChartConfig(
        this.intervals,
        this.values,
        this.xAxisName,
        this.yAxisName)
}

Histogram.prototype.getChartTableData = function() {
    let data = []

    const self = this
    _.forEach(this.intervals, function(o, index, coll) {
        data.push({
            interval: coll[index],
            count: self.values[index]
        })
    })

    return data
}

function createChartConfig(intervals, values, xAxisName, yAxisName) {
    let maxY = _.ceil(_.max(values), -1)
    let linePoints = []
    // linePoints.push(0)
    linePoints = linePoints.concat(values)

    let config = {
        type: "bar",
        data: {
            datasets: [
                {
                    data: linePoints,
                    type: "line",
                    fill: false,
                    backgroundColor: BaseChart.pointBackgroundColor,
                    borderColor: BaseChart.borderColor,
                    borderWidth: BaseChart.borderWidth,
                    pointBorderWidth: BaseChart.pointBorderWidth,
                    pointBorderColor: BaseChart.pointBorderColor,
                    pointRadius: BaseChart.pointRadius,
                    pointHoverRadius: BaseChart.pointHoverRadius,
                },
                {
                    data: values,
                    backgroundColor: "rgba(0, 200, 83, 0.8)",
                    borderWidth: BaseChart.borderWidth,
                    borderColor: "#43a047",
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
                            min: 0,
                            max: maxY
                        }
                    }
                ],
                xAxes: [
                    {
                        id: "x-axis",
                        type: "category",
                        labels: intervals,
                        scaleLabel: {
                            display: true,
                            labelString: xAxisName
                        },
                        barPercentage: 0.9,
                        categoryPercentage: 0.9,
                        ticks: {
                            autoSkip: true,
                            minRotation: 45,
                        }
                    }
                ]
            },
            tooltips: {
                mode: "index",
                intersect: false,
                position: "nearest",
                displayColors: false,
                callbacks: {
                    title: function(tooltipItem, data) {
                        let value = tooltipItem[0].xLabel
                        return `Range : ${value}`
                    },
                    label: function(tooltipItem, data) {
                        if (tooltipItem.datasetIndex === 1) {
                            let value = tooltipItem.yLabel
                            return `Count : ${value}`
                        }
                    }
                }
            }
        }
    }

    return config
}

export {Histogram}
