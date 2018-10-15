<template>
    <base-container
        :border="false"
        shadow="always"
        title="Machine Reliability"
        :strip-title="true">
        <template v-if="reliabilityAtTimePoints">
            <template slot="action">
                <el-switch
                    class="is-mini"
                    v-model="isParallelReliability"
                    active-text="Parallel"
                    inactive-text="Series"/>
            </template>
            <div class="padded-content">
                <el-row :gutter="16">
                    <el-col
                        :xs="24 / valueCards.length"
                        :sm="24 / valueCards.length"
                        v-for="card in valueCards"
                        :key="`card-${card.title}`">
                        <simple-value-card
                            :border="true"
                            :shadow="false"
                            :title="card.title"
                            :value="isParallelReliability? card.parallel : card.series"
                            :unit="card.unit"
                            text-color="#ff5722"
                        />
                    </el-col>
                </el-row>
                <base-container
                    class="vspace"
                    :border="true"
                    :shadow="false">
                    <reliability-chart
                        type="machine"
                        :points="reliabilityChartPoints"/>
                </base-container>
            </div>
        </template>
        <template v-else>
            <el-alert
                title="Warning"
                description="Can't calculate machine reliability due to insufficient failure records data"
                type="warning"
                :show-icon="true"
                :closable="false"/>
        </template>
    </base-container>
</template>

<script>
    import BaseContainer from "../../Container/BaseContainer"
    import SimpleValueCard from "../../Card/SimpleValueCard"
    import ReliabilityChart from "../../Chart/Reliability/ReliabilityChart"

    export default {
        name: "machine-reliability-data",
        components: {ReliabilityChart, SimpleValueCard, BaseContainer},
        props: {
            reliabilityAtTimePoints: {
                type: Array,
                required: true,
                default: () => []
            }
        },
        data() {
            return {
                isParallelReliability: true
            }
        },
        computed: {
            reliabilityChartPoints() {
                if (!this.reliabilityAtTimePoints) {
                    return
                }
                const self = this
                return this._.map(this.reliabilityAtTimePoints, function(t) {
                    return {
                        x: t.timePoint,
                        y: self.isParallelReliability
                            ? t.parallelReliability * 100
                            : t.seriesReliability * 100
                    }
                })
            },
            valueCards() {
                if (!this.reliabilityAtTimePoints) {
                    return []
                }
                return this._.chain(this.reliabilityAtTimePoints)
                    .filter(function(t) {
                        return t.timePoint > 0
                    })
                    .map(function(t) {
                        return {
                            title: `At ${t.timePoint} Hours`,
                            parallel: t.parallelReliability * 100,
                            series: t.seriesReliability * 100,
                            unit: "%"
                        }
                    })
                    .value()
            }
        }
    }
</script>

<style scoped>

</style>
