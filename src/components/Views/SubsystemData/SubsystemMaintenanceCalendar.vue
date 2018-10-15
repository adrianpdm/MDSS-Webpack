<template>
    <timeline-of-failure/>
</template>

<script>
    import TimelineOfFailure from "../../Chart/TimelineOfFailure/TimelineOfFailure"

    export default {
        name: "subsystem-maintenance-calendar",
        components: {TimelineOfFailure},
        props: {
            lastPm: {
                type: [String, Number],
                required: true
            },
            mttf: {
                type: Number,
                required: true
            },
            pmInterval: {
                type: Array,
                default: [2000, 4000]
            }
        }
    }
</script>

<style scoped>

</style>
