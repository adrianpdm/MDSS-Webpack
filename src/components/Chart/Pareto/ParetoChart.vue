<template>
    <base-chart-layout
        chart-title="Pareto Chart"
        :chart-uid="chartUID"
        :chart-config="chartConfig"
        chart-summary-width="50%"
        chart-table-title="Pareto Data Table">
        <template slot="datatable">
            <base-table-layout
                table-title="Pareto Data Table"
                :table-data="chartTableData"
                :table-columns="chartTableColumns"
                :with-border="false"
                :with-pagination="false"
                :with-header="false"
                :row-style="rowStyle"
            />
        </template>
    </base-chart-layout>
</template>

<script>
    import {ParetoChart} from "./index"
    import BaseChartLayout from "../BaseChartLayout"
    import BaseTableLayout from "../../Table/BaseTableLayout"

    export default {
        components: {BaseTableLayout, BaseChartLayout},
        props: {
            data: {
                type: Array,
                required: true,
            },
            xAxisProp: {
                type: String,
                required: true
            },
            xAxisName: {
                type: String,
                required: true
            },
            yAxisProp: {
                type: String,
                required: true
            },
            yAxisName: {
                type: String,
                required: true
            },
        },
        data() {
            return {
                chartObject: {},
                chartUID: "",
                chartConfig: {},
                chartTableData: [],
                chartTableColumns: [
                    {
                        prop: this.xAxisProp,
                        label: this.xAxisName,
                        fixed: "left",
                        required: true,
                    },
                    {
                        prop: this.yAxisProp,
                        label: this.yAxisName,
                        required: true,
                    },
                    {
                        prop: "proportion",
                        label: "Proportion (%)",
                        required: true,
                    },
                    {
                        prop: "cumulativeProportion",
                        label: "Cumulative Proportion (%)",
                        required: true,
                    }
                ]
            }
        },
        created() {
            this.createChartObject()
        },
        computed: {},
        methods: {
            createChartObject() {
                let chartObject = new ParetoChart(
                    this.data,
                    this.xAxisProp,
                    this.yAxisProp,
                    this.xAxisName,
                    this.yAxisName
                )

                this.chartObject = chartObject
                this.chartUID = chartObject.getChartUID()
                this.chartConfig = chartObject.getChartConfig()
                this.chartTableData = chartObject.getChartTableData()
            },
            rowStyle({row, rowIndex}) {
                let color, fontWeight
                if (row.cumulativeProportion <= 80) {
                    color = "#d84315"
                    fontWeight = 500
                } else {
                    color = "#757575"
                    fontWeight = 400
                }
                return {color, fontWeight}
            },
        },
    }
</script>

<style scoped lang="scss">
</style>
