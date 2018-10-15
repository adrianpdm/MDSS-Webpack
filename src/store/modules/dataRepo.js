import _ from "lodash"
import {_titleCase} from "../../filters"


let store = {
    state: {
        filename: "",
        entryDate: 0,
        computationTime: 0,
        dataOfMachines: [],
        isDataExist: false,
        isCostDataExist: false,
        machineTreeNodes: [],
        maintenanceCostPerInterval: [],
        isCostDataReady: false,
    },
    mutations: {
        "save-meta-data"(state, meta) {
            state.filename = meta.filename
            state.entryDate = meta.entryDate
            state.computationTime = meta.computationTime
        },
        "save-data-of-machines"(state, data) {
            state.dataOfMachines = data
        },
        "change-data-state"(state, value) {
            state.isDataExist = value
        },
        "save-machine-tree-nodes"(state, nodes) {
            state.machineTreeNodes = nodes
        },
        "save-maintenance-cost-data"(state, costData) {
            _.forEach(costData, (cost) => _.forEach(state.dataOfMachines, function(m) {
                if (m.machineId !== cost.machineId) {
                    return
                }

                _.forEach(m.subsystems, function(sub) {
                    if (cost.subsystem !== sub.subsystem) {
                        return
                    }

                    let maintenanceCost = _.omit(cost, [
                        "machineId",
                        "subsystem"
                    ])

                    _.assignIn(sub, maintenanceCost)
                    console.log(sub)
                })
            }))
            state.isCostDataExist = true
        },
        "change-cost-data-state"(state, value) {
            state.isCostDataExist = value
        },
        "save-optimum-pm-interval-data"(state, data) {
            let result = []
            _.forEach(data, (d) => _.forEach(state.dataOfMachines, function(m) {
                if (m.machineId !== d.machineId) {
                    return
                }

                _.forEach(m.subsystems, function(sub) {
                    if (sub.subsystem !== d.subsystem) {
                        return
                    }

                    let item = {
                        machineId: sub.machineId,
                        subsystem: sub.subsystem,
                    }

                    sub.costForEachOptions = d.costForEachOptions
                    let selectedOpts = _.minBy(d.costForEachOptions, function(o) {
                        return o.cumulativeCost
                    })

                    let costForEachOptions = d.costForEachOptions
                    _.forEach(costForEachOptions, function(opt, index) {
                        let optName = `opt_${index + 1}`
                        if (selectedOpts) {
                            item[optName] = opt.cumulativeCost
                            if (opt.cumulativeCost === selectedOpts.cumulativeCost) {
                                item.selected = optName
                            }
                        } else {
                            item[optName] = "-"
                            item.selected = "opt_3"
                        }
                    })

                    sub.selectedOpts = selectedOpts
                        ? selectedOpts.opts
                        : [2000, 4000]
                    result.push(item)
                })
            }))

            state.maintenanceCostPerInterval = result
            state.isCostDataReady = true
        }
    },
    actions: {
        saveMetaData({commit}, meta) {
            let fields = [
                "filename",
                "entryDate",
                "computationTime",
            ]

            let isValid = _.every(fields, function(f) {
                let valid = meta.hasOwnProperty(f)
                if (!valid) {
                    console.error(`(${f}) is undefined in failure records meta data`)
                }
                return valid
            })

            if (isValid) {
                commit("save-meta-data", meta)
            }
        },
        saveDataOfMachines({commit}, data) {
            commit("save-data-of-machines", data)
            commit("change-data-state", true)
        },
        saveMaintenanceCost({commit}, costData) {
            commit("save-maintenance-cost-data", costData)
        }
    },
    getters: {
        getAllMachineData: (state) => {
            return _.map(state.dataOfMachines, function(m) {
                return m
            })
        },
        getMachineDataById: (state) => (options) => {
            let id = options.machineId
            return _.find(state.dataOfMachines, function(m) {
                return m.machineId === id
            })
        },
        getSubsystemCostData: (state) => {
            let result = []
            let machineData = state.dataOfMachines
            _.forEach(machineData, (m) => {
                _.forEach(m.subsystems, (sub) => {
                    let subsystem = {
                        mfc: m.mfc,
                        desc: m.desc,
                        type: m.type,
                        cmHours: sub.repairData.meanOfRate
                    }
                    _.assignIn(subsystem, sub)
                    result.push(subsystem)
                })
            })
            return result
        },
        getAllSubsystemsDataByMachineID: (state) => (options) => {
            let machineId = options.machineId
            let machine = _.find(state.dataOfMachines, function(m) {
                return m.machineId === machineId
            })

            if (!machine) {
                return
            }

            let data = machine.subsystems

            if (!options.orderBy) {
                return data
            }

            let orderBy = options.orderBy
            let order = !options.order
                ? _.fill(Array(orderBy.length), "asc")
                : options.order

            data = _.orderBy(data, orderBy, order)
            return data
        },
        getSubsystemDataByNameAndMachineID: (state) => (options) => {
            let machineId = options.machineId
            let subsystem = options.subsystem

            let machine = _.find(state.dataOfMachines, function(m) {
                return m.machineId === machineId
            })

            let data = _.find(machine.subsystems, function(sub) {
                return sub.subsystem === subsystem
            })

            return data
        },
        getMachineTreeNodes: (state) => {
            if (state.machineTreeNodes.length > 0) {
                return [].concat(state.machineTreeNodes)
            }

            let machineNodes = []
            const LEVEL_MACHINE = 0
            const LEVEL_SUBSYSTEM = 1

            _.forEach(state.dataOfMachines, (m) => {
                let id = `${m.machineId}`
                let text = `${m.machineId} - ${_titleCase(m.mfc)}`
                let value = {
                    machineId: m.machineId,
                    mfc: m.mfc
                }
                const symbol = "M"
                const symbolClass = "clr-deep-orange"
                // const icon = m.reliabilityAtDefaultPMInterval
                //     ? `far fa-check-circle ${symbolClass}`
                //     : "far fa-question-circle clr-grey-lighter"
                const icon = ""
                let thisMachineNode = {
                    id,
                    text,
                    value,
                    symbol,
                    symbolClass,
                    icon,
                    level: LEVEL_MACHINE
                }

                let isMachineNodeExist = _.find(machineNodes, function(node) {
                    return node.value.machineId === m.machineId
                })

                if (!isMachineNodeExist) {
                    machineNodes.push(thisMachineNode)
                }

                let subsystemNodes = []
                _.forEach(m.subsystems, function(sub) {
                    let id = `${sub.machineId} ${sub.subsystem}`
                    let text = sub.subsystem
                    let value = {
                        machineId: sub.machineId,
                        subsystem: sub.subsystem
                    }
                    const symbol = "S"
                    const symbolClass = "clr-green"
                    const icon = sub.failureData.method === "parametric" || sub.repairData.method === "parametric"
                        ? `far fa-check-circle ${symbolClass}`
                        : "far fa-question-circle clr-grey-lighter"
                    let thisSubsystemNode = {
                        id,
                        text,
                        value,
                        symbol,
                        symbolClass,
                        icon,
                        level: LEVEL_SUBSYSTEM
                    }

                    subsystemNodes.push(thisSubsystemNode)
                })

                thisMachineNode.children = _.orderBy(subsystemNodes, ["icon", "text"], ["asc", "asc"])
            })

            return machineNodes
        },
    }

}

export default store
