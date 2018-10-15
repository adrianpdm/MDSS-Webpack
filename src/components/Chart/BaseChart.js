let _chartUID = 0

function BaseChart(chartName) {
    _chartUID += 1
    this.chartName = chartName
    this.chartUID = _chartUID
}

BaseChart.prototype.getChartUID = function() {
    return `${this.chartName}-${this.chartUID}`
}

Object.defineProperties(BaseChart, {
    pointBackgroundColor: {value: "rgba(200, 200, 200, 0.3)"},
    borderWidth: {value: 4},
    borderColor: {value: "#424242"},
    pointBorderColor: {value: "rgba(66, 66, 66, 0.75)"},
    pointBorderWidth: {value: 4},
    pointRadius: {value: 6},
    pointHitRadius: {value: 6},
    pointHoverRadius: {value: 10}
})

export default BaseChart
