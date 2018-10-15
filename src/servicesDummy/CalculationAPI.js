import ReliabilityFunction from "./calculations/ReliabilityFunction"

let baseURL = "/calculation"

function reliabilityOfSubsequentPM(pmInterval, distribution, parameters) {
    let result = {
        reliability: ReliabilityFunction.valuesOfSubsequentPM(pmInterval, distribution, parameters),
        cumulativeReliability: ReliabilityFunction.cumulativeValuesOfSubsequentPM(pmInterval, distribution, parameters),
        failures: ReliabilityFunction.expectedFailuresOfSubsequentPM(pmInterval, distribution, parameters)
    }

    let reliability = _.map(result.reliability, function(o) {
        return {
            x: o.timePoint,
            y: o.reliability * 100
        }
    })
    let cumulativeReliability = _.map(result.cumulativeReliability, function(o) {
        return {
            x: o.timePoint,
            y: o.reliability * 100
        }
    })

    return {reliability, cumulativeReliability, failures: result.failures}
}

const CalculationAPI = {
    reliabilityOfSubsequentPM,
}

export {CalculationAPI}
