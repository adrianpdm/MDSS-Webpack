function RateProperties(variableName, unit, unitFactor, numberFormat) {
    this.variableName = variableName
    this.unit = unit
    this.unitFactor = unitFactor
    this.numberFormat = numberFormat
}

const failureDataProp = new RateProperties(
    "Time To Failure",
    "hours",
    1,
    "0.0"
)
const repairDataProp = new RateProperties(
    "Time To Repair",
    "hours",
    0.01,
    "0.000"
)

function getRateProperties(rateProp) {
    switch (rateProp) {
        case "failureData":
            return failureDataProp
        case "repairData":
            return repairDataProp
    }
}

const BasePropMixin = {
    methods: {
        getRateVariableName: function(prop) {
            return getRateProperties(prop).variableName
        },
        getRateUnit: function(prop) {
            return getRateProperties(prop).unit
        },
        getRateUnitFactor: function(prop) {
            return getRateProperties(prop).unitFactor
        },
        getRateNumberFormat: function(prop) {
            return getRateProperties(prop).numberFormat
        }
    }
}

export {
    BasePropMixin
}
