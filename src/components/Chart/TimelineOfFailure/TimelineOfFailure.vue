<template>
    <timeline
        ref="schedule"
        :groups="timelineData.groups"
        :items="timelineData.items"
        :options="options"/>
</template>

<script>
    import moment from "moment"
    import Timeline from "vue2vis/src/components/Timeline"

    export default {
        name: "timeline-of-failure",
        components: {Timeline},
        props: {},
        data() {
            return {
                chartObject: {},
                chartUID: "",
                chartConfig: {},
                groups: [{
                    id: 0,
                    content: "Group 1"
                }],
                items: [{
                    id: 0,
                    group: 0,
                    start: new Date(),
                    content: "Coba"
                }],
                options: {
                    height: "720px",
                    orientation: "both",
                    editable: false,
                    locale: "id",
                    zoomMin: 604800000,
                    align: "left",
                    verticalScroll: true,
                }
            }
        },
        created() {

        },
        mounted() {

        },
        computed: {
            timelineData() {
                if (!this.$store.state.data_repo.isCostDataReady) {
                    return
                }

                let groups = []
                let items = []
                this._.forEach(this.$store.getters.getAllMachineData, (m) => {

                    let group = {}
                    group.id = m.machineId
                    group.content = m.machineId
                    group.nestedGroups = []

                    let nestedGroups = []
                    this._.forEach(m.subsystems, (sub) => {
                        let subsystemGroupId = `${sub.subsystem}-${m.machineId}`
                        let subsystemGroupName = sub.subsystem
                        nestedGroups.push(subsystemGroupId)

                        let latestPMDate = this._.findLast(sub.maintenanceRecords, function(rec) {
                            return rec.jobType === "PM"
                        })

                        latestPMDate = latestPMDate.entryDate

                        items.push({
                            id: `${subsystemGroupId}-lastPM`,
                            group: subsystemGroupId,
                            start: latestPMDate,
                            content: `Latest PM - ${moment(latestPMDate).format("DD MMM YYYY")}`
                        })

                        if (sub.failureData && sub.failureData.method === "parametric") {
                            let mttf = sub.failureData.meanOfRate
                            let numberOFFailure = this._.round(4000 / mttf, 0)
                            for (let i = 0; i < numberOFFailure; i++) {
                                let index = i + 1
                                let operationalTTFHours = mttf * 24 / 16 * 7 / 5
                                let predictedFailureDate = moment(latestPMDate)
                                    .add(operationalTTFHours * index, "hours")
                                    .startOf("day")
                                    .format()
                                items.push({
                                    id: `${subsystemGroupId}-mttf-${i}`,
                                    group: subsystemGroupId,
                                    start: predictedFailureDate,
                                    content: `MTBF - ${moment(predictedFailureDate).format("DD MMM YYYY")}`
                                })
                            }
                        }

                        let selectedOpts = sub.selectedOpts

                        let intervals = selectedOpts
                            ? selectedOpts
                            : [2000, 4000]

                        this._.forEach(intervals, function(int) {
                            let nextPMInHours = int * 24 / 16 * 7 / 5
                            let nextDate = moment(latestPMDate)
                                .add(nextPMInHours, "hours")
                                .startOf("day")
                                .format()
                            items.push({
                                id: `${subsystemGroupId}-${int}`,
                                group: subsystemGroupId,
                                start: nextDate,
                                content: `Level ${int} - ${moment(nextDate).format("DD MMM YYYY")}`
                            })
                        })
                        groups.push({
                            id: subsystemGroupId,
                            content: subsystemGroupName
                        })
                    })
                    group.nestedGroups = nestedGroups.sort((a, b) => a - b)
                    groups.push(group)
                })
                items = this._.orderBy(items, ["id", "group"], ["asc", "asc"])
                groups = this._.orderBy(groups, ["id"], ["asc"])
                return {groups, items}
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>
