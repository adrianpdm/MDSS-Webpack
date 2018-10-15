<template>
    <div class="c_base-chart-container clearfix">
        <div class="c_chart-block  c_chart-canvas" :style="chartCanvasStyle">
            <div class="c_chart-block-title">
                {{chartTitle}}
            </div>
            <div class="c_chart-canvas-container" :style="{height: computedChartHeight}">
                <canvas
                    :id="chartUid">
                </canvas>
            </div>
            <div class="c_chart_legend">
                <slot name="legend"></slot>
            </div>
        </div>
        <div v-if="isWithSummary" class="c_chart-block c_chart-summary" :style="chartSummaryStyle">
            <slot name="custom"></slot>
            <slot name="datatable"></slot>
            <base-table-layout
                v-if="chartTableData && chartTableColumns"
                :table-title="chartTableTitle"
                :table-data="chartTableData"
                :table-columns="chartTableColumns"
                :with-border="false"
                :with-pagination="false"
                :with-header="false"/>
        </div>
    </div>
</template>

<script>
    import BaseTableLayout from "../Table/BaseTableLayout"

    export default {
        name: "base-chart-layout",
        components: {BaseTableLayout},
        props: {
            chartUid: {
                type: String,
                required: true,
            },
            chartTitle: {
                type: String,
                required: true
            },
            chartConfig: {
                type: Object,
                required: true
            },
            chartHeight: {
                type: Number,
                default: 320
            },
            chartSummaryWidth: {
                type: [Number, String],
            },
            chartTableTitle: {
                type: String
            },
            chartTableData: {
                type: Array,
            },
            chartTableColumns: {
                type: Array
            }
        },
        data() {
            return {
                chartCanvas: {},
                defaultSummaryWidth: "250px"
            }
        },
        beforeMount() {

        },
        mounted() {
            this.renderChart()
        },
        watch: {
            chartConfig() {
                this.chartCanvas.config = this.chartConfig
                this.chartCanvas.update()
            }
        },
        computed: {
            isWithSummary() {
                return this.$slots.custom || this.$slots.datatable || this.chartTableData
            },
            computedChartHeight() {
                return this._.isNumber(this.chartHeight) ? `${this.chartHeight}px` : this.chartHeight
            },
            computedChartSummaryWidth() {
                if (!this.isWithSummary) {
                    return "0px"
                }

                if (this.chartSummaryWidth) {
                    return this._.isNumber(this.chartSummaryWidth)
                        ? `${this.chartSummaryWidth}px`
                        : this.chartSummaryWidth
                } else {
                    return this.defaultSummaryWidth
                }
            },
            chartCanvasStyle() {
                return {
                    width: `calc(100% - ${this.computedChartSummaryWidth})`
                }
            },
            chartSummaryStyle() {
                return {
                    width: this.computedChartSummaryWidth
                }
            },
        },
        methods: {
            renderChart() {
                this.chartCanvas = this.$createChart(this.chartUid, this.chartConfig, this.computedChartHeight)
            }
        }
    }
</script>

<style scoped lang="scss">
    div.c_base-chart-container {
        @include box-sizing(border-box);
        position: relative;
        height: 100%;
        padding: 0;
        overflow: hidden;
    }

    div.c_chart-block {
        @include box-sizing(border-box);
        padding: 12px;
        position: relative;
        display: block;
    }

    div.c_chart-block.c_chart-canvas {
        @include box-sizing(border-box);
        position: relative;
        float: left;

        &:not(:last-child)::after {
            position: absolute;
            content: '';
            top: 0;
            bottom: 0;
            right: 0;
            width: 1px;
            background: $clr-grey-300;
            z-index: 10;
        }
    }

    div.c_chart-block.c_chart-canvas .c_chart-block-title {
        @extend %container-title;
        text-align: center;
    }

    div.c_chart-block.c_chart-canvas canvas {
        z-index: 10;
    }

    div.c_chart-canvas-container {
        position: relative;
    }

    div.c_chart-block.c_chart-summary {
        position: absolute;
        padding: 0;
        top: 0;
        right: 0;
        height: 100%;
        float: right;
        overflow-x: hidden;
        overflow-y: auto;
    }

    div.c_chart_legend {
        width: 100%;
    }
</style>
