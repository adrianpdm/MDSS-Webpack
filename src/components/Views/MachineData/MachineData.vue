<template>
    <div
        :key="`machine-data-of-${machineId}`"
        class="padded-content">
        <entity-title-card
            :machine-id="machineId"/>

        <base-container
            class="vspace"
            :border="false"
            shadow="always"
            title="Machine Maintenance Records Table"
            :strip-title="true">
            <maintenance-records-table
                dataset="machine"
                :machine-id="machineId"/>
        </base-container>

        <base-container
            class="vspace"
            :border="false"
            shadow="always"
            title="Machine Downtime Statistics"
            :strip-title="true">
            <el-tabs
                class="tab-layout padded-content"
                v-model="activeStatisticsTab">
                <el-tab-pane
                    v-for="(tab, i) in statisticTabs"
                    :key="`tab-${i}`"
                    :lazy="true"
                    :name="tab.name"
                    :label="tab.label">
                    <base-container
                        class="vspace"
                        :border="true"
                        :shadow="false">
                        <component
                            :is="getTabComponentType(tab)"
                            v-bind="getTabComponentProperties(tab)"/>
                    </base-container>
                </el-tab-pane>
            </el-tabs>
        </base-container>

    </div>
</template>

<script>
    import EntityTitleCard from "../../Card/EntityTitleCard"
    import MaintenanceRecordsTable from "../../Table/MaintenanceRecordsTable"
    import BaseContainer from "../../Container/BaseContainer"
    import ParetoChart from "../../Chart/Pareto/ParetoChart"

    const tfdt = "totalFrequencyOfDowntime"
    const tdt = "totalDowntime"

    export default {
        name: "machine-data",
        components: {
            BaseContainer,
            EntityTitleCard,
            MaintenanceRecordsTable,
            ParetoChart
        },
        props: {
            machineId: String
        },
        data() {
            return {
                statisticTabs: [
                    {name: tfdt, label: "Frequency Of Downtime"},
                    {name: tdt, label: "Downtime Length"},
                ],
                activeStatisticsTab: "",
            }
        },
        beforeMount() {
            this.initPage()
        },
        computed: {
            machineData() {
                return this.$store.getters.getMachineDataById({
                    machineId: this.machineId
                })
            },
            subsystemsData() {
                return this.$store.getters.getAllSubsystemsDataByMachineID({machineId: this.machineId})
            },
            machineReliabilityAtTimePoints() {
                return this.machineData.reliabilityAtDefaultPMInterval
            }
        },
        methods: {
            initPage() {
                this.activeStatisticsTab = this.statisticTabs[0].name
            },
            getTabComponentType(tab) {
                switch (tab.name) {
                    case tfdt:
                    case tdt:
                        return ParetoChart
                }
            },
            getTabComponentProperties(tab) {
                switch (tab.name) {
                    case tfdt:
                        return {
                            data: this.subsystemsData,
                            xAxisProp: "subsystem",
                            xAxisName: "Subsystems",
                            yAxisProp: tfdt,
                            yAxisName: "Frequency of Downtime"
                        }
                    case tdt:
                        return {
                            data: this.subsystemsData,
                            xAxisProp: "subsystem",
                            xAxisName: "Subsystems",
                            yAxisProp: tdt,
                            yAxisName: "Downtime Length (hours)"
                        }
                }
            }
        },
        watch: {}
    }
</script>

<style scoped>

</style>
