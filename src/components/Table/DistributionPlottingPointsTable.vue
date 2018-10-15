<template>
    <base-table-layout
        table-title="Distribution Fitting Plotting Points"
        :table-data="tableData"
        :table-columns="tableColumns"/>
</template>

<script>
    import BaseTableLayout from "./BaseTableLayout"
    import {BasePropMixin} from "../BasePropMixins"
    import BaseContainer from "../Container/BaseContainer"

    export default {
        name: "distribution-plotting-points-table",
        mixins: [BasePropMixin],
        components: {BaseContainer, BaseTableLayout},
        props: {
            data: {
                type: Array,
                required: true
            },
            rateProp: {
                type: String,
                required: true
            },
        },
        data() {
            return {}
        },
        computed: {
            tableData() {
                return this.data
            },
            tableColumns() {
                return [
                    {
                        prop: "value",
                        label: `${this.getRateVariableName(this.rateProp)} (t) (${this.getRateUnit(this.rateProp)})`,
                        required: true
                    },
                    {
                        prop: "medianRank",
                        label: "Median Rank (Ft)",
                        required: true
                    },
                    {
                        label: "Distribution",
                        required: true,
                        children: [
                            {
                                label: "Normal",
                                required: true,
                                children: [
                                    {prop: "xNormal", label: "x", headerAlign: "center"},
                                    {prop: "yNormal", label: "y", headerAlign: "center"}
                                ]
                            },
                            {
                                label: "Lognormal",
                                required: true,
                                children: [
                                    {prop: "xLognormal", label: "x", headerAlign: "center"},
                                    {prop: "yLognormal", label: "y", headerAlign: "center"}
                                ]
                            },
                            {
                                label: "Exponential",
                                required: true,
                                children: [
                                    {prop: "xExponential", label: "x", headerAlign: "center"},
                                    {prop: "yExponential", label: "y", headerAlign: "center"}
                                ]
                            },
                            {
                                label: "Weibull",
                                required: true,
                                children: [
                                    {prop: "xWeibull", label: "x", headerAlign: "center"},
                                    {prop: "yWeibull", label: "y", headerAlign: "center"}
                                ]
                            }
                        ]
                    }
                ]
            },
        },
        methods: {}
    }
</script>

<style scoped>

</style>
