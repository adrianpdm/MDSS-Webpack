<template>
    <div
        :key="`subsystem-data-of-${machineId}-${subsystem}}`"
        class="padded-content">

        <entity-title-card :machine-id="machineId" :subsystem="subsystem"/>

        <el-row
            v-if="isParametric"
            class="vspace"
            :gutter="16">
            <el-col
                :xs="24 / valueCards.length"
                :sm="24 / valueCards.length"
                v-for="(card, i) in valueCards"
                :key="`card-${i}-${card.prop}`">
                <simple-value-card
                    :border="false"
                    shadow="always"
                    :title="card.title"
                    :value="card.value"
                    :unit="card.unit"
                    text-color="#00c853"
                />
            </el-col>
        </el-row>

        <el-tabs
            class="tab-layout vspace"
            v-model="activeMenuTab">
            <el-tab-pane
                :lazy="true"
                name="failureRecords"
                label="Maintenance Records">
                <base-container
                    class="vspace"
                    :border="false"
                    shadow="always"
                    title="Subsystem Maintenance Records Table"
                    :strip-title="true">
                    <maintenance-records-table
                        dataset="subsystem"
                        :machine-id="machineId"
                        :subsystem="subsystem"
                        :include-pm="true"/>
                </base-container>
            </el-tab-pane>
            <el-tab-pane
                :lazy="true"
                v-if="isParametric"
                name="reliability"
                label="Reliability Analysis">
                <base-container
                    v-if="isParametric"
                    class="vspace"
                    :border="false"
                    shadow="always"
                    title="Reliability Analysis"
                    :strip-title="true">
                    <subsystem-reliability-data
                        class="padded-content"
                        style="padding-top: 0;"
                        :failure-data="rateFunctionData('failureData')"/>
                </base-container>
            </el-tab-pane>
            <el-tab-pane
                :lazy="true"
                v-if="isParametric"
                name="failureData"
                label="Failure Data Analysis">
                <base-container
                    v-if="isParametric"
                    class="vspace"
                    :border="false"
                    shadow="always"
                    title="Failure Data Analysis"
                    :strip-title="true">
                    <subsystem-rate-function-data
                        class="padded-content"
                        style="padding-top: 0;"
                        rate-prop="failureData"
                        :rate-function-data="rateFunctionData('failureData')"
                    />
                </base-container>
            </el-tab-pane>
            <el-tab-pane
                :lazy="true"
                v-if="isParametric"
                name="repairData"
                label="Repair Data Analysis">
                <base-container
                    v-if="isParametric"
                    class="vspace"
                    :border="false"
                    shadow="always"
                    title="Repair Data Analysis"
                    :strip-title="true">
                    <subsystem-rate-function-data
                        class="padded-content"
                        style="padding-top: 0;"
                        rate-prop="repairData"
                        :rate-function-data="rateFunctionData('repairData')"
                    />
                </base-container>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import BaseLayout from "../../../pages/Base/BaseLayout"
    import BaseContainer from "../../Container/BaseContainer"
    import SimpleValueCard from "../../Card/SimpleValueCard"
    import EntityTitleCard from "../../Card/EntityTitleCard"
    import MaintenanceRecordsTable from "../../Table/MaintenanceRecordsTable"
    import SubsystemReliabilityData from "./SubsystemReliabilityData"
    import SubsystemRateFunctionData from "./SubsystemRateFunctionData"

    export default {
        name: "subsystem-data",
        components: {
            BaseContainer,
            BaseLayout,
            EntityTitleCard,
            SimpleValueCard,
            MaintenanceRecordsTable,
            SubsystemReliabilityData,
            SubsystemRateFunctionData
        },
        props: {
            machineId: String,
            subsystem: String,
        },
        data() {
            return {
                menuTabs: [
                    {name: "failureRecords", label: "Maintenance Records"},
                    {name: "reliability", label: "Reliability Analysis"},
                    {name: "failureData", label: "Failure Data Analysis"},
                    {name: "repairData", label: "Downtime Analysis"}
                ],
                activeMenuTab: "",
            }
        },
        created() {
            this.initPage()
        },
        computed: {
            machineData() {
                return this.$store.getters.getMachineDataById({
                    machineId: this.machineId
                })
            },
            subsystemData() {
                return this.$store.getters.getSubsystemDataByNameAndMachineID({
                    machineId: this.machineId,
                    subsystem: this.subsystem
                })
            },
            valueCards() {
                let failureRecordsCount = this.subsystemData.totalFrequencyOfDowntime
                let mttf = this.subsystemData.failureData.meanOfRate
                let mttr = this.subsystemData.repairData.meanOfRate

                return [
                    {title: "Failure Records", value: failureRecordsCount, unit: "records"},
                    {title: "Mean Time Between Failure", value: mttf, unit: "hours"},
                    // {title: "Mean Time To Repair", value: mttr, unit: "hours"},
                ]
            },
            isParametric() {
                return this.rateFunctionData("failureData").method === "parametric"
            },
        },
        methods: {
            initPage() {
                this.activeMenuTab = this.menuTabs[0].name
            },
            rateFunctionData(prop) {
                return this.subsystemData[prop]
            },
            getTabComponentType(tab) {
                switch (tab.name) {
                    case "reliability":
                        return SubsystemReliabilityData
                    case "failureData":
                    case "repairData":
                        return SubsystemRateFunctionData
                }
            },
            getTabComponentProperties(tab) {
                switch (tab.name) {
                    case "reliability":
                        return {
                            failureData: this.rateFunctionData("failureData")
                        }
                    case "failureData":
                        return {
                            rateProp: "failureData",
                            rateFunctionData: this.rateFunctionData("failureData")
                        }
                    case "repairData":
                        return {
                            rateProp: "repairData",
                            rateFunctionData: this.rateFunctionData("repairData")
                        }
                }
            }
        },
        watch: {
            machineId() {
                this.initPage()
            },
            subsystem() {
                this.initPage()
            },
        }
    }
</script>

<style scoped lang="scss">
    .c_data-title {
        @extend %container-title;
    }
</style>
