<template>
    <base-table-layout
        table-title="Failure Records Data Table"
        :table-data="tableData"
        :table-columns="tableColumns"
        :stripe="false"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        :with-index="false"/>
</template>

<script>
    import BaseTableLayout from "./BaseTableLayout"
    import {stringFormatter} from "../../store/functions"
    import moment from "moment"

    let tableIndexNumber = 1

    export default {
        name: "maintenance-records-table",

        components: {
            BaseTableLayout
        },

        props: {
            dataset: {
                type: String,
                required: true
            },
            machineId: {
                type: String,
            },
            subsystem: {
                type: String,
            },
            columns: {
                type: Array,
            },
            includePm: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                baseColumns: [
                    {
                        label: "No.",
                        required: true,
                        align: "center",
                        width: 50,
                        templateFunction: (scope) => {
                            if (scope.row.jobType === "PM") {
                                return ""
                            }
                            if (scope.$index > 0) {
                                let previousRow = this.tableData[scope.$index - 1]
                                if (previousRow.jobType === "PM") {
                                    tableIndexNumber = 1
                                } else {
                                    tableIndexNumber += 1
                                }
                                return tableIndexNumber
                            }
                            if (scope.$index === 0) {
                                tableIndexNumber = 1
                                return tableIndexNumber
                            }
                        }
                    },
                    {
                        prop: "jobType",
                        label: "Job Type",
                        required: true
                    },
                    {
                        prop: "machineId",
                        label: "Machine ID",
                        required: false,
                        init: true
                    },
                    {
                        prop: "subsystem",
                        label: "Subsystem",
                        required: false,
                        init: true
                    },
                    {
                        prop: "entryDate",
                        label: "Issued Date",
                        required: false,
                        init: true
                    },
                    {
                        prop: "finishDate",
                        label: "Delivery Date",
                        required: false,
                        init: true
                    },
                    {
                        prop: "downtime",
                        label: "Downtime (hours)",
                        required: true
                    },
                    {
                        prop: "timeToFailure",
                        label: "Time To Failure (hours)",
                        required: true,
                        templateFunction: function(scope) {
                            return scope.row.timeToFailure !== undefined
                                ? stringFormatter("timeToFailure", scope.row.timeToFailure)
                                : "-"
                        }
                    },
                    {
                        prop: "timeToRepair",
                        label: "Time To Repair (hours)",
                        required: true
                    },
                    {
                        prop: "isFirstFailureAfterPM",
                        label: "1st Failure After PM",
                        required: false,
                        type: Boolean
                    }
                ],
            }
        },
        computed: {
            tableData() {
                return this._.orderBy(
                    this.maintenanceRecords,
                    ["entryDate"],
                    ["asc"]
                )
            },
            tableColumns() {
                return this.baseColumns
            },
            maintenanceRecords() {
                switch (this.dataset) {
                    case "machine":
                        return this.machineRecords
                    case "subsystem":
                        return this.subsystemRecords
                    default:
                        return []
                }
            },
            machineRecords() {
                const self = this
                let thisMachine = this.$store.getters.getMachineDataById({
                    machineId: this.machineId
                })
                let result = []
                this._.forEach(thisMachine.subsystems, function(sub) {
                    self._.forEach(sub.maintenanceRecords, function(record) {
                        let isExist = self._.find(result, function(f) {
                            return f.jobType === record.jobType
                                && moment(f.entryDate).isSame(record.entryDate)
                                && moment(f.finishDate).isSame(record.finishDate)
                        })
                        if (!isExist) {
                            result.push(record)
                        }
                    })
                })

                return result
            },
            subsystemRecords() {
                let subsystemData = this.$store.getters.getSubsystemDataByNameAndMachineID({
                    machineId: this.machineId,
                    subsystem: this.subsystem
                })

                return subsystemData.maintenanceRecords
            }
        },
        methods: {
            rowStyle({row, rowIndex}) {
                if (row.jobType === "PM") {
                    return {
                        backgroundColor: rowIndex % 2 === 0 ? "#eeeeee" : "#f5f5f5",
                    }
                }
            },
            cellStyle({row, rowIndex, column, columnIndex}) {
                if (row.jobType === "PM") {
                    let drawBorderTop = rowIndex > 0 && this.tableData[rowIndex - 1].jobType !== "PM"
                    return {
                        borderTop: drawBorderTop ? "1px solid" : "none",
                        borderColor: rowIndex % 2 === 0 ? "#dcdcdc" : "#e6e6e6"
                    }
                }
            },
            spanMethod({row, column, rowIndex, columnIndex}) {
                if (row.jobType === "PM") {
                    if (column.label === "No.") {
                        return [1, 1]
                    } else if (column.property === "jobType") {
                        return [1, this.baseColumns.length]
                    } else {
                        return [1, 0]
                    }
                }
                return {
                    rowspan: 1,
                    colspan: 1
                }
            }
        }
    }
</script>

<style scoped>

</style>
