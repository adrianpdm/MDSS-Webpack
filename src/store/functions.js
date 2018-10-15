let numeral = require("numeral")
let moment = require("moment")

import {_titleCase} from "../filters"
import _ from "lodash"

const NameType = [
    "mfc",
    "desc",
    "type"
]
const DateType = [
    "entryDate",
    "finishDate"
]
const NumberType = [
    "count",
    "value",
    "downtime",
    "totalDowntime",
    "totalFrequencyOfDowntime",
    "timeToFailure",
    "timeToRepair",
    "timeSinceLastPM",
    "cmCost",
    "pmCost",
    "cumulativeCost"
]
const PercentType = [
    "proportion",
    "cumulativeProportion"
]
const PreciseType = [
    "medianRank",
    "xNormal", "yNormal",
    "xLognormal", "yLognormal",
    "xExponential", "yExponential",
    "xWeibull", "yWeibull",
    "reliability",
    "meanNumberOfFailures",
    "cumulativeMeanNumberOfFailures"
]

function stringFormatter(prop, value) {
    if (value === undefined) {
        return ""
    }
    if (NameType.indexOf(prop) !== -1) {
        return _titleCase(value)
    }
    if (DateType.indexOf(prop) !== -1) {
        let date = moment(value)
        return date.format("YYYY/MM/DD")
    }
    if (NumberType.indexOf(prop) !== -1) {
        return numeral(value).format("0[.]00")
    }
    if (PreciseType.indexOf(prop) !== -1) {
        if (Math.abs(value) < Math.pow(10, -6)) {
            return 0
        }
        return numeral(value).format("0[.]000")
    }
    if (PercentType.indexOf(prop) !== -1) {
        return numeral(value / 100).format("0.000%")
    }

    if (_.isString(value)) {
        return value
    }

    if (_.isNumber(value)) {
        return numeral(value).format("0[.]000")
    }

    return value
}

function tableDataFormatter(row, col, value, index) {
    let prop = col.property
    return stringFormatter(prop, value)
}

export {
    stringFormatter,
    tableDataFormatter
}
