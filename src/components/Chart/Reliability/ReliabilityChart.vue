<template>
    <div class="clearfix" style="position: relative">
        <subsystem-distribution-parameters
            title="MTBF"
            :distribution="failureData.distribution"
            :parameters="failureData.parameters"
            :rate-type="failureData.rateType"
            />
        <base-container
            v-if="chartUID && chartConfig"
            class="vspace"
            :border="true"
            :shadow="false">
            <base-chart-layout
                chart-title="Reliability Function Chart"
                :chart-uid="chartUID"
                :chart-config="chartConfig"
                chart-table-title="Expected Failures"
                :chart-table-data="numberOfFailuresData"
                :chart-table-columns="numberOfFailuresTableColumns">
                <template slot="custom">
                    <div class="c_reliability-custom-input">
                        <div class="c_input-title">
                            PM Interval Options (hours)
                        </div>
                        <el-select
                            class="vspace-sm"
                            v-model="selectedIntervalIndex"
                            size="small"
                            :clearable="false"
                            :multiple="false"
                            @change="onChangePMIntervalOption">
                            <el-option
                                v-for="(option, i) in pmIntervalOptions"
                                :key="`pm-interval-option-${i}`"
                                :value="option.value"
                                :label="option.interval.join(' , ')"/>
                        </el-select>
                    </div>
                </template>
                <template slot="legend">
                    <div class="c_chart-legend">
                        <div class="legend-r"></div>
                        <span>PM</span>
                        <br/>
                        <div class="legend-cum-r"></div>
                        <span>Cumulative PM</span>
                        <br/>
                        <div class="legend-no-pm"></div>
                        <span>Without PM</span>
                    </div>
                </template>
            </base-chart-layout>
        </base-container>
    </div>
</template>

<script>
    import BaseChartLayout from "../BaseChartLayout"
    import {ReliabilityChart} from "./index"
    import BaseContainer from "../../Container/BaseContainer"

    import {CalculationAPI} from "../../../servicesDummy/CalculationAPI"
    import BaseTableLayout from "../../Table/BaseTableLayout"
    import SimpleValueCard from "../../Card/SimpleValueCard"
    import SubsystemDistributionParameters from "../../Views/SubsystemData/SubsystemDistributionParameters"

    export default {
        name: "reliability-chart",
        components: {
            SubsystemDistributionParameters,
            SimpleValueCard,
            BaseContainer,
            BaseChartLayout
        },
        props: {
            failureData: {
                type: Object,
                required: true,
            },
            type: {
                type: String,
                enum: ["machine", "subsystem"],
                default: "subsystem"
            },
        },
        data() {
            return {
                chartObject: {},
                chartUID: "",
                chartConfig: {},
                pmIntervalOptions: [
                    {value: 0, interval: [500, 1000, 2000, 4000]},
                    {value: 1, interval: [1000, 2000, 4000]},
                    {value: 2, interval: [2000, 4000]},
                    {value: 3, interval: [4000]}
                ],
                defaultSelectedIntervalIndex: 2,
                selectedIntervalIndex: undefined,
                numberOfFailuresTableColumns: [
                    {
                        prop: "interval",
                        label: "PM Interval (hours)",
                        required: true,
                    },
                    {
                        prop: "meanNumberOfFailures",
                        label: "Expected Number of Failures",
                        required: true,
                    },
                ],
                numberOfFailuresData: 0,
            }
        },
        created() {
            this.createChartObject(
                this.defaultReliabilityPoints,
                this.defaultCumulativeReliabilityPoints,
                this.defaultReliabilityWithoutPM)
            this.setNumberOfFailuresData(this.defaultNumberOfFailuresData)
        },
        beforeMount() {
            this.selectedIntervalIndex = this.defaultSelectedIntervalIndex
        },
        mounted() {

        },
        computed: {
            defaultReliabilityWithoutPM() {
                return this._.map(this.failureData.reliabilityWithoutPM, function(o) {
                    return {
                        x: o.timePoint,
                        y: o.reliability * 100
                    }
                })
            },
            defaultReliabilityPoints() {
                return this._.map(this.failureData.reliabilityAtDefaultPMInterval, function(o) {
                    return {
                        x: o.timePoint,
                        y: o.reliability * 100
                    }
                })
            },
            defaultCumulativeReliabilityPoints() {
                return this._.map(this.failureData.cumulativeReliabilityAtDefaultPMInterval, function(o) {
                    return {
                        x: o.timePoint,
                        y: o.reliability * 100
                    }
                })
            },
            defaultNumberOfFailuresData() {
                return this.failureData.numberOfFailuresAtDefaultPMInterval
            },
            pmIntervalValues() {
                return this.pmIntervalOptions[this.selectedIntervalIndex].interval
            },
        },
        methods: {
            createChartObject(points, cumulativePoints, withoutPMPoints) {
                this.chartObject = {}
                this.chartUID = ""
                this.chartConfig = {}
                let chartObject = new ReliabilityChart(points, cumulativePoints, withoutPMPoints)
                this.chartObject = chartObject
                this.chartUID = chartObject.getChartUID()
                this.chartConfig = chartObject.getChartConfig()
            },
            setNumberOfFailuresData(data) {
                this.numberOfFailuresData = data
            },
            onChangePMIntervalOption() {
                let points
                let cumulativePoints
                if (this.selectedIntervalIndex !== this.defaultSelectedIntervalIndex) {
                    let {reliability, cumulativeReliability, failures} = CalculationAPI.reliabilityOfSubsequentPM(this.pmIntervalValues, this.failureData.distribution, this.failureData.parameters)
                    points = reliability
                    cumulativePoints = cumulativeReliability
                    this.setNumberOfFailuresData(failures)
                } else {
                    points = this.defaultReliabilityPoints
                    cumulativePoints = this.defaultCumulativeReliabilityPoints
                    this.setNumberOfFailuresData(this.defaultNumberOfFailuresData)
                }
                this.createChartObject(points, cumulativePoints, this.defaultReliabilityWithoutPM)
            },
        }
    }
</script>

<style scoped lang="scss">
    div.c_reliability-custom-input {
        @include box-sizing(border-box);
        border-bottom: 1px solid $clr-grey-300;
        padding: 12px 16px;
    }

    .c_input-title {
        text-transform: uppercase;
        color: $clr-light-blue-a400;
        letter-spacing: 0.05em;
        font-weight: 700;
        font-size: 12px;
    }

    div.c_reliability-summary {
        @include box-sizing(border-box);
        position: relative;
        display: block;
        padding: 12px 16px;
    }

    div.c_title {
        @extend %container-title;
        position: relative;
        margin-bottom: 12px;
    }

    div.c_reliability-summary {

        > div {
            display: block;
        }

        > div:not(.c_title)::after {
            content: '';
            clear: both;
            display: table;
        }

        > div > span {
            display: block;
            float: left;
            color: $clr-grey-800;
            font-weight: 400;

            & + span {
                float: right;
                font-weight: 500;
                color: $clr-green-a700;
            }
        }
    }

    div.c_chart-legend > *{
        display: inline-block;
        font-size: 13px;
        font-weight: 400;
    }

    .legend-r{
        width: 64px;
        border-top: 4px solid $clr-blue-700;
        margin-right: 16px;
    }

    .legend-cum-r{
        width: 64px;
        border-top: 4px dashed $clr-green;
        margin-right: 16px;
    }

    .legend-no-pm{
        width: 64px;
        border-top: 4px dotted $clr-red;
        margin-right: 16px;
    }

</style>
