import DefaultConfig from "./DefaultConfig"
import DistributionStatisticFunction from "./DistributionStatisticFunction"

const DistStatFn = DistributionStatisticFunction
const cdf = DistStatFn.cdf

const _toLower = require("lodash/toLower")
const _map = require("lodash/map")
const _includes = require("lodash/includes")
const _forEach = require("lodash/forEach")
const _concat = require("lodash/concat")
const _round = require("lodash/round")
const _floor = require("lodash/floor")
const _ceil = require("lodash/ceil")
const _maxBy = require("lodash/maxBy")
const _reduce = require("lodash/reduce")

function ReliabilityValueAtTimePoint(timePoint, reliability) {
	this.timePoint = timePoint
	this.reliability = reliability
}

const valueOf = function(x, distribution, parameters) {
	let Ft = cdf(x, distribution, parameters)
	return new ReliabilityValueAtTimePoint(x, 1 - Ft)
}

const valueOfSinglePM = function(x, T, distribution, params, isCumulative) {
	let n

	if (x < T) {
		n = 0
	} else if (x === T) {
		n = 1
	} else {
		n = _floor(x / T, 0)
	}

	let RT = isCumulative
		? valueOf(T, distribution, params).reliability
		: 1
	let RtnT = valueOf(x - (n * T), distribution, params).reliability
	let Rm = Math.pow(RT, n) * RtnT

	return new ReliabilityValueAtTimePoint(x, Rm)
}

const valuesOfSubsequentPM = function(pmInterval, distribution, parameters) {
	let result = []

	const intervalTimePoints = DefaultConfig.getIntervalTimePoints(pmInterval)
	_forEach(intervalTimePoints, function(int) {
		let values = _map(int.points, function(p) {
			let x = p - int.timeReference
			let reliability = valueOfSinglePM(x, int.T, distribution, parameters).reliability
			return new ReliabilityValueAtTimePoint(p, reliability)
		})
		result = _concat(result, values)
	})

	return result
}

const cumulativeValuesOfSubsequentPM = function(pmInterval, distribution, parameters) {
	let result = []

	const intervalTimePoints = DefaultConfig.getIntervalTimePoints(pmInterval)
	_forEach(intervalTimePoints, function(int, index) {
		let values = _map(int.points, function(p) {
			if (index <= 0) {
				let reliability = valueOf(p, distribution, parameters).reliability
				return new ReliabilityValueAtTimePoint(p, reliability)
			} else {
				let x = p
				let T = intervalTimePoints[index - 1].T
				let reliability = valueOfSinglePM(x, T, distribution, parameters, true).reliability
				return new ReliabilityValueAtTimePoint(p, reliability)
			}
		})
		result = _concat(result, values)
	})

	return result
}

const expectedFailures = function(t, distribution, parameters) {
	let mean, stdev
	if (_toLower(distribution) !== "exponential"){
		mean = DistStatFn.meanOf(distribution, parameters)
		stdev = Math.sqrt(DistStatFn.varianceOf(distribution, parameters))
	}
	let cumulativeProbability = 0
	let probabilities = []

	for (let j = 0; _ceil(cumulativeProbability, 3) <= 0.999; j++) {
		let k = j + 1
		let thisMean = k * mean
		let thisStDev = stdev * Math.sqrt(k)
		let Pr
		if (_toLower(distribution) !== "exponential"){
			Pr = 1 - DistStatFn.cdf(t, "normal", {mean: thisMean, stdev: thisStDev})
			if (j > 0) {
				let z = k - 1
				let previousMean = z * mean
				let previousStDev = stdev * Math.sqrt(z)
				Pr = Pr - (1 - DistStatFn.cdf(t, "normal", {mean: previousMean, stdev: previousStDev}))
			}
		} else {
			let lambda = parameters.lambda
			let factorial = 1
			for (let x = j; x > 0; x--){
				factorial = factorial * x
			}
			Pr = Math.pow(lambda * t, j) * Math.exp(-1 * lambda * t) / factorial
		}

		cumulativeProbability += Pr
		probabilities.push({
			j,
			Pr
		})

	}

	let meanNumberOfFailures = 0
	_forEach(probabilities, function(p) {
		meanNumberOfFailures += p.j * p.Pr
	})

	return _round(meanNumberOfFailures, 0)
}

const expectedFailuresOfSubsequentPM = function(pmInterval, distribution, parameters) {
	let result = []

	let cumulative = 0
	_forEach(pmInterval, function(int, index) {
		let previousInterval = index === 0
			? 0
			: pmInterval[index - 1]
		let t = index === 0
			? int
			: int - previousInterval
		let mean = expectedFailures(t, distribution, parameters)
		cumulative += mean
		result.push({
			t: int,
			interval: previousInterval + " - " + int,
			meanNumberOfFailures: mean,
			cumulativeMeanNumberOfFailures: cumulative
		})
	})

	return result
}

export default {
	valueOf,
	valueOfSinglePM,
	valuesOfSubsequentPM,
	expectedFailures,
	expectedFailuresOfSubsequentPM,
	cumulativeValuesOfSubsequentPM
}
