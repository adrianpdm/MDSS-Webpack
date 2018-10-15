<template>
    <base-chart-layout
        chart-title="Histogram"
        :chart-uid="chartUID"
        :chart-config="chartConfig"
        chart-table-title="Classes Interval"
        :chart-table-data="chartTableData"
        :chart-table-columns="chartTableColumns"
    />
</template>

<script>
    import {Histogram} from "./index"
    import {BasePropMixin} from "../../BasePropMixins"
    import BaseTableLayout from "../../Table/BaseTableLayout"
    import BaseChartLayout from "../BaseChartLayout"

    export default {
        name: "histogram-chart",
        components: {BaseChartLayout, BaseTableLayout},
        mixins: [BasePropMixin],
        props: {
            data: {
                type: Array,
                required: true
            },
            rateProp: {
                type: String,
                required: true,
            },
        },
        data() {
            return {
                yAxisName: "Count",
                chartObject: undefined,
                chartUID: "",
                chartConfig: {},
                chartTableData: [],
                chartTableColumns: [
                    {
                        prop: "interval",
                        label: "Interval",
                        required: true,
                        headerAlign: "center"
                    },
                    {
                        prop: "count",
                        label: "Count",
                        required: true,
                        headerAlign: "center",
                        width: 72,
                    }
                ]
            }
        },
        created() {
            this.createChartObject()
        },
        computed: {
            xAxisName() {
                return this.getRateVariableName(this.rateProp)
            },
            unitFactor() {
                return this.getRateUnitFactor(this.rateProp)
            },
            numberFormat() {
                return this.getRateNumberFormat(this.rateProp)
            },
        },
        methods: {
            createChartObject() {
                let chartObject = new Histogram(this.data, this.xAxisName, this.yAxisName, this.unitFactor, this.numberFormat)
                this.chartObject = chartObject
                this.chartUID = chartObject.getChartUID()
                this.chartConfig = chartObject.getChartConfig()
                this.chartTableData = chartObject.getChartTableData()
            },
        },
    }
</script>

<style scoped lang="scss">

</style>
