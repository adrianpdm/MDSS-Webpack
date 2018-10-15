import Chart from "../../../node_modules/chart.js/src/chart"
import ChartAnnotation from "chartjs-plugin-annotation"

const _ = require("lodash")

Chart.defaults.global.title.fontSize = 14
Chart.defaults.global.defaultColor = "#f5f5f5"

Chart.defaults.global.animation.duration = 1000

Chart.defaults.global.legend.display = false
Chart.defaults.global.title.display = false

let globalTooltipsOptions = {
    xPadding: 16,
    yPadding: 12,
    backgroundColor: "#fafafa",
    borderColor: "#9e9e9e",
    borderWidth: 2,
    titleFontColor: "#212121",
    titleFontSize: 13,
    titleFontStyle: "bold",
    bodyFontColor: "#212121",
    bodyFontSize: 13,
    bodyFontStyle: "bold",
    displayColors: false,
}

_.assign(Chart.defaults.global.tooltips, globalTooltipsOptions)

function createChart(chartId, config, height) {
    let ctx = document.getElementById(chartId)

    if (!ctx) {
        console.log("Chart canvas element ID not found:", chartId)
        return
    }

    if (height) {
        ctx.height = height
    }
    return new Chart(ctx, config)
}

let globalChartingPlugin = {
    install(Vue) {
        Vue.prototype.$createChart = createChart
    }
}

export default globalChartingPlugin
