<template>
    <div v-if="isParametric">
        <reliability-chart
            type="subsystem"
            :failure-data="failureData"/>
    </div>
</template>

<script>
    import ReliabilityChart from "../../Chart/Reliability/ReliabilityChart"
    import SimpleValueCard from "../../Card/SimpleValueCard"
    import BaseContainer from "../../Container/BaseContainer"
    import TimelineOfFailure from "../../Chart/TimelineOfFailure/TimelineOfFailure"

    export default {
        name: "subsystem-reliability-data",
        components: {TimelineOfFailure, BaseContainer, SimpleValueCard, ReliabilityChart},
        props: {
            failureData: {
                type: Object,
                required: true
            },
        },
        data() {
            return {}
        },
        created() {

        },
        beforeMount() {

        },
        mounted() {

        },
        computed: {
            isParametric() {
                return this.failureData.method === "parametric"
            },
            inCardReliabilityTimePoints() {
                return this._.filter(this.failureData.reliabilityAtDefaultPMInterval, function(o) {
                    return o.timePoint > 0
                })
            },
        },
        methods: {}
    }
</script>

<style scoped lang="scss">
    .c_title {
        @extend %container-title;
    }

</style>
