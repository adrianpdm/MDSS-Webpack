import BaseChart from "../BaseChart"

const numeral = require("numeral")
const _assignIn = require("lodash/assignIn")
const _maxBy = require("lodash/maxBy")
const _toNumber = require("lodash/toNumber")
const _map = require("lodash/map")
const _compact = require("lodash/compact")

function ReliabilityChart(points = [], cumulativePoints = [], withoutPMPoints = []) {
    let chartName = "reliability-chart"
    _assignIn(this, new BaseChart(chartName))
    this.points = points
    this.cumulativePoints = cumulativePoints
    this.withoutPMPoints = withoutPMPoints
}

ReliabilityChart.prototype.getChartConfig = function() {
    return createChartConfig(this.points, this.cumulativePoints, this.withoutPMPoints)
}

function createChartConfig(points, cumulativePoints, withoutPMPoints) {

    let pmPoints = _map([500, 1000, 2000, 4000], function(p){
        return {
            id: `pm-${p}`,
            type: "line",
            mode: "vertical",
            scaleID: "x-axis",
            value: p,
            borderColor: "#e1e1e1",
            borderWidth: 3,
        }
    })

    let maxOfX = _maxBy(points, function(p) {
        return p.x
    }).x

    let config = {
        type: "line",
        data: {
            datasets: [
                {
                    label: "Reliability",
                    data: points,
                    fill: false,
                    backgroundColor: "rgba(25, 118, 210, 1)",
                    borderCapStyle: "round",
                    borderColor: "rgba(25, 118, 210, 0.55)",
                    borderWidth: 5,
                    pointBorderColor: "rgba(0, 200, 83, 0.0)",
                    pointBorderWidth: 0,
                    pointRadius: 5,
                    pointHoverRadius: 12,
                    lineTension: 0
                },
                {
                    label: "Cumulative Reliability",
                    data: cumulativePoints,
                    fill: false,
                    borderDash: [14, 18],
                    borderCapStyle: "square",
                    borderColor: "rgba(56, 142, 60, 0.75)",
                    borderWidth: 4,
                    pointBorderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    lineTension: 0
                },
                {
                    label: "Without PM",
                    data: withoutPMPoints,
                    fill: false,
                    borderDash: [1, 16],
                    borderCapStyle: "round",
                    borderColor: "rgba(230, 74, 25, 1)",
                    borderWidth: 5,
                    pointBorderWidth: 0,
                    pointRadius: 0,
                    pointHoverRadius: 0,
                    lineTension: 0
                }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        id: "y-axis",
                        display: true,
                        type: "linear",
                        position: "left",
                        scaleLabel: {
                            display: true,
                            labelString: "Reliability (%)",
                            fontSize: 13,
                        },
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 110,
                            callback: function(value, index, values) {
                                return _toNumber(value) <= 100 ? value : ""
                            }
                        }
                    },
                ],
                xAxes: [
                    {
                        id: "x-axis",
                        type: "linear",
                        scaleLabel: {
                            display: true,
                            labelString: "Interval (hours)",
                        },
                        ticks: {
                            min: 0,
                            max: maxOfX,
                            stepSize: 500
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
                        return `at ${numeral(value).format("0[.]000")} hours`
                    },
                    label: function(tooltipItem, data) {
                        if (tooltipItem.datasetIndex === 0) {
                            let value = tooltipItem.yLabel
                            return `R : ${numeral(value).format("0[.]000")}%`
                        }
                        if (tooltipItem.datasetIndex === 1) {
                            let value = tooltipItem.yLabel
                            return `Sigma R : ${numeral(value).format("0[.]000")}%`
                        }
                        if (tooltipItem.datasetIndex === 2) {
                            let value = tooltipItem.yLabel
                            return `No PM : ${numeral(value).format("0[.]000")}%`
                        }
                    }
                }
            },
            annotation: {
                drawTime: "beforeDatasetsDraw",
                annotations: pmPoints
            }
        }
    }

    return config
}

export {ReliabilityChart}
