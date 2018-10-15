<template>
    <div :key="`${rateProp}-data`" v-if="isParametric">
        <subsystem-distribution-parameters
            :title="rateProp === 'failureData'? 'MTBF' : 'MTTR'"
            :distribution="rateFunctionData.distribution"
            :parameters="rateFunctionData.parameters"
            :rate-type="rateFunctionData.rateType"/>
        <base-container
            class="vspace"
            :border="true"
            :shadow="false">
            <histogram-chart
                :key="`${rateProp}-histogram-chart`"
                :data="rateDataValues"
                :rate-prop="rateProp"/>
        </base-container>
        <base-container
            class="vspace c_correlation-chart-container clearfix"
            :border="false"
            :shadow="false">
            <div class="c_correlation_chart_sidebar">
                <div class="c_correlation_chart_sidebar_title">
                    Distribution
                </div>
                <el-menu
                    class="c_el-menu"
                    mode="vertical"
                    :default-active="activeChartTab"
                    @select="onSelectChartTab">
                    <el-menu-item
                        :class="{'is-active': chart.distribution === activeChartTab}"
                        v-for="(chart, i) in plottingSummaries"
                        :index="chart.distribution"
                        :key="`correlation-${i}-${chart.distribution}`">
                        <span
                            class="c_menu_item_chart_title" :class="{'c_is_most_fitted': i === 0}">
                          {{chart.distribution}}
                        </span>
                    </el-menu-item>
                </el-menu>
            </div>
            <base-container
                v-if="activeChartPlottingSummary"
                :border="true"
                :shadow="false"
                class="c_correlation_chart_main">
                <distribution-correlation-chart
                    :key="`${rateProp}-correlation-chart-${activeChartPlottingSummary.distribution}`"
                    :rate-prop="rateProp"
                    :distribution="activeChartPlottingSummary.distribution"
                    :plotting-points="plottingPoints"
                    :plotting-summary="activeChartPlottingSummary"/>
            </base-container>
        </base-container>

        <div class="vspace">
            <el-button
                type="primary"
                size="small"
                style="width: 100%"
                :round="false"
                @click="isShowPlottingPoints = !isShowPlottingPoints">
                {{isShowPlottingPoints? "Hide Plotting Points": "Show Plotting Points"}}
            </el-button>
        </div>

        <base-container
            v-if="isShowPlottingPoints"
            class="vspace"
            :border="true"
            :shadow="false"
            title="Distribution Fitting Plotted Points">
            <distribution-plotting-points-table
                :data="plottingPoints"
                :rate-prop="rateProp"/>
        </base-container>
    </div>
</template>

<script>
    import DistributionPlottingPointsTable from "../../Table/DistributionPlottingPointsTable"
    import DistributionCorrelationChart from "../../Chart/Correlation/DistributionCorrelationChart"
    import HistogramChart from "../../Chart/Histogram/Histogram"

    import {BasePropMixin} from "../../BasePropMixins"
    import BaseContainer from "../../Container/BaseContainer"
    import SubsystemDistributionParameters from "./SubsystemDistributionParameters"

    export default {
        name: "subsystem-rate-function-data",
        mixins: [BasePropMixin],
        components: {
            SubsystemDistributionParameters,
            BaseContainer,
            HistogramChart,
            DistributionCorrelationChart,
            DistributionPlottingPointsTable
        },
        props: {
            rateProp: {
                type: String,
                required: true
            },
            rateFunctionData: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                activeChartTab: "",
                plottingPoints: this.rateFunctionData.plottingPoints,
                plottingSummaries: this.rateFunctionData.plottingSummaries,
                isParametric: this.rateFunctionData.method === "parametric",
                isShowPlottingPoints: false,
            }
        },
        beforeMount() {

        },
        mounted() {
            this.initPage()
        },
        updated() {

        },
        computed: {
            rateDataValues() {
                return this._.map(this.plottingPoints, "value")
            },
            activeChartPlottingSummary() {
                return this._.find(this.plottingSummaries, (d) => {
                    return this._.toLower(d.distribution) === this._.toLower(this.activeChartTab)
                })
            },
        },
        methods: {
            initPage() {
                let charts = this.rateFunctionData.plottingSummaries
                if (charts.length > 0) {
                    this.activeChartTab = charts[0].distribution
                }
            },
            onSelectChartTab(index, indexPath) {
                this.activeChartTab = index
            },
        }
    }
</script>

<style scoped lang="scss">
    $correlation-chart-sidebar-width: 150px;

    .c_title {
        @extend %container-title;
    }

    .c_correlation-chart-container {
        @include box-sizing(border-box);
        position: relative;
        width: 100%;
        height: 100%;
        border: none;
        padding: 0;
        overflow: hidden;

    }

    div.c_correlation_chart_sidebar {
        @include box-sizing(border-box);
        position: absolute;
        display: block;
        top: 0;
        left: 0;
        bottom: 0;
        width: $correlation-chart-sidebar-width;
        overflow-x: hidden;
        overflow-y: auto;
        border: 1px solid $clr-grey-300;
        border-radius: 8px;

        .c_correlation_chart_sidebar_title {
            @extend %container-title;
            margin-bottom: 0 !important;
            padding: 12px 16px;
        }

        .c_el-menu {
            border: none !important;
        }

        .c_el-menu /deep/ li.el-menu-item {
            border-top: 1px solid $clr-grey-300;
            padding-left: 16px !important;
            padding-right: 16px !important;

            &:last-of-type {
                border-bottom: 1px solid $clr-grey-300;
            }

            &.is-active {
                background-color: $clr-grey-100;
            }
        }
    }

    div.c_correlation_chart_main {
        @include box-sizing(border-box);
        position: relative;
        float: right;
        display: block;
        width: calc(100% - #{$correlation-chart-sidebar-width} - 12px);
        height: 100%;
    }

    span.c_menu_item_chart_title {
        font-weight: 500;
        font-size: 13px;
        color: $clr-grey-800;

        &.c_is_most_fitted {

        }

        &.c_is_most_fitted::after {
            position: absolute;
            right: 16px;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.05em;
            content: 'FIT';
            color: orangered;
        }
    }
</style>
