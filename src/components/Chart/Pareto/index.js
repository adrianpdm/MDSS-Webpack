import BaseChart from "../BaseChart"

const _ = require("lodash")

function ParetoChart(data, xAxisProp, yAxisProp, xAxisName, yAxisName) {
    let chartName = "pareto-chart"
    _.assignIn(this, new BaseChart(chartName))
    this.data = data
    this.xAxisProp = xAxisProp
    this.yAxisProp = yAxisProp
    this.xAxisName = xAxisName
    this.yAxisName = yAxisName
    this.prepareChartData()
}

ParetoChart.prototype.prepareChartData = function() {
    let data = _.orderBy(this.data, [this.yAxisProp], "desc")

    let cumulativeValue = _.sumBy(data, d => d[this.yAxisProp])

    let _labels = []
    let _values = []
    let _cumulativeProportions = []
    let _tableData = []

    let cumulativeProportion = 0
    for (let i = 0; i < data.length; i++) {
        let x = data[i][this.xAxisProp]
        let y = data[i][this.yAxisProp]
        let proportion = (y / cumulativeValue) * 100
        cumulativeProportion += proportion

        _labels[i] = x
        _values[i] = y
        _cumulativeProportions[i] = cumulativeProportion

        _tableData[i] = {
            [this.xAxisProp]: x,
            [this.yAxisProp]: y,
            proportion,
            cumulativeProportion
        }
    }

    this.labels = _labels
    this.values = _values
    this.cumulativeProportions = _cumulativeProportions
    this.tableData = _tableData
}

ParetoChart.prototype.getChartConfig = function() {
    return createChartConfig(
        this.xAxisName,
        this.yAxisName,
        this.labels,
        this.values,
        this.cumulativeProportions
    )
}

ParetoChart.prototype.getChartTableData = function() {
    return this.tableData
}

function createChartConfig(xAxisName, yAxisName, labels, values, cumulativeProportions) {
    let barColors = _.map(cumulativeProportions, (prop) => {
        if (prop <= 80) {
            return "#ff5722"
        } else {
            return "#ffe082"
        }
    })

    let suggestedMax = _.max(values) >= 5 && _.max(values) % 5 === 0
        ? _.ceil(_.max(values) / 5, 0) * 5 + 2.5
        : _.ceil(_.max(values) / 5, 0) * 5

    const self = this
    const PROPORTIONS = 0
    const VALUES = 1

    let config = {
        type: "bar",
        data: {
            datasets: [
                {
                    type: "line",
                    fill: false,
                    label: "Cumulative Proportion (%)",
                    xAxisID: "x-axis",
                    yAxisID: "lines-y-axis",
                    backgroundColor: BaseChart.pointBackgroundColor,
                    borderColor: BaseChart.borderColor,
                    borderWidth: BaseChart.borderWidth,
                    pointBorderWidth: BaseChart.pointBorderWidth,
                    pointRadius: BaseChart.pointRadius,
                    pointHoverRadius: BaseChart.pointHoverRadius,
                    lineTension: 0,
                    data: cumulativeProportions
                },
                {
                    type: "bar",
                    label: yAxisName,
                    xAxisID: "x-axis",
                    yAxisID: "bars-y-axis",
                    backgroundColor: barColors,
                    borderColor: "#fff",
                    borderWidth: 2,
                    data: values
                }
            ]
        },
        options: {
            scales: {
                yAxes: [
                    {
                        id: "bars-y-axis",
                        display: true,
                        type: "linear",
                        position: "left",
                        scaleLabel: {
                            display: true,
                            labelString: yAxisName,
                            fontSize: 13,
                        },
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            beginAtZero: true,
                            suggestedMax: suggestedMax,
                        }
                    },
                    {
                        id: "lines-y-axis",
                        display: true,
                        type: "linear",
                        position: "right",
                        scaleLabel: {
                            display: true,
                            labelString: "Cumulative Proportion (%)",
                            fontSize: 13,
                        },
                        ticks: {
                            beginAtZero: true,
                            min: 0,
                            max: 120,
                            stepSize: 20,
                            callback: function(value, index, values) {
                                return _.toNumber(value) <= 100 ? value : ""
                            }
                        }
                    }
                ],
                xAxes: [
                    {
                        id: "x-axis",
                        type: "category",
                        labels: labels,
                        barPercentage: 1.0,
                        categoryPercentage: 1.0,
                        ticks: {
                            autoSkip: false,
                        }
                    }
                ]
            },
            tooltips: {
                mode: "index",
                intersect: false,
                position: "nearest",
                backgroundColor: "#fafafa",
                titleFontColor: "#212121",
                titleFontSize: 13,
                bodyFontColor: "#212121",
                bodyFontSize: 13,
                callbacks: {
                    label: function(tooltipItem, data) {
                        let index = tooltipItem.datasetIndex

                        let field = data.datasets[index].label || ""
                        let value = tooltipItem.yLabel

                        let text = `${field} : ${_.round(value, 2)}`
                        if (index === PROPORTIONS) {
                            text += " %"
                        }
                        return text
                    }
                }
            },
            annotation: {
                annotations: [
                    {
                        type: "line",
                        mode: "horizontal",
                        scaleID: "lines-y-axis",
                        value: 80,
                        borderColor: "#d50000",
                        borderWidth: 2,
                        borderDash: [6, 12],
                    }
                ]
            }
        }
    }
    return config
}

export {ParetoChart}
