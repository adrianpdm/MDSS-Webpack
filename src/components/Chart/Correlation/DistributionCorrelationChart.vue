<template>
    <base-chart-layout
        chart-title="Correlation Chart"
        :chart-uid="chartUID"
        :chart-config="chartConfig">
        <template slot="custom">
            <div class="c_plotting-summary">
                <template>
                    <div class="c_title" style="margin-bottom: 0">Goodness Of Fit</div>
                    <div>
                        <span class="c_title">
                            {{`(${plottingSummary.goodnessOfFit.testName})`}}
                        </span>
                    </div>
                    <div class="c_hypothesis">
                        <span>{{`H0`}} :</span>
                        <span :class="plottingSummary.goodnessOfFit.accepted? 'clr-deep-orange' : 'clr-grey'">
                            is {{plottingSummary.distribution.toLowerCase()}}
                        </span>
                    </div>
                    <div class="c_hypothesis">
                        <span>{{`H1`}} :</span>
                        <span :class="!plottingSummary.goodnessOfFit.accepted? 'clr-deep-orange' : 'clr-grey'">
                            is not {{plottingSummary.distribution.toLowerCase()}}
                        </span>
                    </div>
                    <div class="c_gof-crit">
                        <div>
                            {{`Accept H0 if`}} <br/>
                            {{plottingSummary.goodnessOfFit.crit}}
                        </div>
                    </div>
                    <div>
                        <span>Result</span>
                        <span class="clr-deep-orange">{{plottingSummary.goodnessOfFit.accepted ? "accept H0" : "accept H1"}}</span>
                    </div>
                    <div>
                        <span>{{plottingSummary.goodnessOfFit.testStat.name}}</span>
                        <span>{{formatValue(plottingSummary.goodnessOfFit.testStat.value)}}</span>
                    </div>
                    <div
                        v-for="(crit, i) in plottingSummary.goodnessOfFit.testCrit"
                        :key="`crit-${i}-${crit.name}`">
                        <span>{{crit.name}}</span>
                        <span>{{formatValue(crit.value)}}</span>
                    </div>
                </template>
                <template>
                    <div class="c_title vspace">Pearson Product Moment</div>
                    <div>
                        <span>Index of Fit</span>
                        <span class="clr-deep-orange">{{formatValue(plottingSummary.r_value)}}</span>
                    </div>
                    <div>
                        <span>Slope</span>
                        <span>{{formatValue(plottingSummary.slope)}}</span>
                    </div>
                    <div>
                        <span>Y-Intercept</span>
                        <span>{{formatValue(plottingSummary.y_intercept)}}</span>
                    </div>
                </template>
                <template>
                    <div class="c_title vspace" style="margin-bottom: 0">Parameter Estimator</div>
                    <div>
                        <span class="c_title">
                            (Least Square)
                        </span>
                    </div>
                    <div
                        v-for="(value, name) in plottingSummary.parameters"
                        :key="`param-${name}`">
                        <span>{{toTitleCase(name)}}</span>
                        <span>{{formatValue(value)}}</span>
                    </div>
                </template>
            </div>
        </template>
    </base-chart-layout>
</template>

<script>
    import {CorrelationChart} from "./index"
    import {BasePropMixin} from "../../BasePropMixins"
    import RateFunctionTable from "../../Table/DistributionPlottingPointsTable"
    import BaseChartLayout from "../BaseChartLayout"

    export default {
        name: "distribution-correlation-chart",
        components: {BaseChartLayout, RateFunctionTable},
        mixins: [BasePropMixin],
        props: {
            distribution: {
                type: String
            },
            rateProp: {
                type: String,
                required: true
            },
            plottingPoints: {
                type: Array,
                required: true,
            },
            plottingSummary: {
                type: Object,
            },
        },
        data() {
            return {
                activeChartTab: "",
                chartObject: {},
                chartUID: "",
                chartConfig: {},
                xAxisProp: `x${this.distribution}`,
                yAxisProp: `y${this.distribution}`,
            }
        },
        created() {
            this.createChartObject()
        },
        computed: {
            xAxisName() {
                let rateName = this.getRateVariableName(this.rateProp)
                if (["normal", "exponential"].indexOf(this._.toLower(this.distribution)) !== -1) {
                    return rateName
                } else {
                    return `ln(${rateName})`
                }
            },
            yAxisName() {
                switch (this._.toLower(this._.toLower(this.distribution))) {
                    case "normal":
                        return `Z\u207b\u2071(F\u209c)`
                    case "lognormal":
                        return `Z\u207b\u2071(F\u209c)`
                    case "exponential":
                        return `ln (F\u209c)`
                    case "weibull":
                        return `ln (ln(F\u209c))`
                }
            },
        },
        methods: {
            createChartObject() {
                let chartObject = new CorrelationChart(
                    this.distribution,
                    this.plottingPoints,
                    this.xAxisProp,
                    this.yAxisProp,
                    this.xAxisName,
                    this.yAxisName,
                    this.plottingSummary.slope,
                    this.plottingSummary.y_intercept
                )
                this.chartObject = chartObject
                this.chartUID = chartObject.getChartUID()
                this.chartConfig = chartObject.getChartConfig()
            },
            formatValue(value) {
                return this._.round(value, 5)
            },
        },
        watch: {},
    }
</script>

<style scoped lang="scss">
    div.c_plotting-summary {
        @include box-sizing(border-box);
        display: block;
        padding: 12px 16px;
    }

    div.c_plotting-summary .c_title {
        @extend %container-title;
        position: relative;
        margin-bottom: 8px;
    }

    div.c_plotting-summary div + .c_title {
        padding-top: 12px;

        &::before {
            content: '';
            position: absolute;
            background-color: $clr-grey-300;
            height: 1px;
            top: 0;
            width: 100%;
        }
    }

    div.c_plotting-summary > div {
        display: block;
    }

    div.c_plotting-summary div.c_gof-crit {
        border: 1px solid $clr-grey-300;
        border-radius: 4px;
        color: $clr-grey-900;
        padding: 6px 8px;
        text-align: center;
        margin: 4px 0;
        display: block;

        > div {
            font-size: 12px;
        }
    }

    div.c_plotting-summary div.c_hypothesis > span {
        font-size: 12px;
        color: $clr-grey-800;
        font-weight: 500;
    }

    div.c_plotting-summary > div:not(.c_title)::after {
        content: '';
        clear: both;
        display: table;
    }

    div.c_plotting-summary > div > span {
        display: block;
        float: left;
        font-weight: 400;
        color: $clr-grey-800;

        & + span {
            float: right;
            font-weight: 500;
            color: $clr-green-a700;
        }
    }

</style>
