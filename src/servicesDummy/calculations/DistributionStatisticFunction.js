import {SwitchDistribution} from "./DistributionUtils"

const _toLower = require("lodash/toLower")
const _includes = require("lodash/includes")
const jStat = require("jStat").jStat

const characteristic = function(property, distribution, parameters) {
	let value

	SwitchDistribution([distribution, parameters], {
		normal: ({mean, stdev}) => {
			value = jStat.normal[property](mean, stdev)
		},
		lognormal: ({mu, tmed, shape, stdev}) => {
			let mean = tmed * Math.exp(Math.pow(shape, 2) / 2)
			value = jStat.normal[property](mean, stdev)
		},
		exponential: ({lambda}) => {
			value = jStat.exponential[property](lambda)
		},
		weibull: ({theta, beta}) => {
			value = jStat.weibull[property](theta, beta)
		},
	})

	return value
}

const meanOf = function(distribution, parameters) {
	return characteristic("mean", distribution, parameters)
}

const varianceOf = function(distribution, parameters) {
	return characteristic("variance", distribution, parameters)
}

const medianOf = function(distribution, parameters) {
	return characteristic("median", distribution, parameters)
}

const modeOf = function(distribution, parameters) {
	return characteristic("median", distribution, parameters)
}

const sampleOf = function(distribution, parameters) {
	return characteristic("sample", distribution, parameters)
}

const densityFunction = function(property, x, distribution, parameters) {
	let value

	SwitchDistribution([distribution, parameters], {
		normal: ({mean, stdev}) => {
			value = jStat.normal[property](x, mean, stdev)
		},
		lognormal: ({tmed, mu, shape}) => {
			// let mean = tmed * Math.exp(Math.pow(shape, 2) / 2)
			value = jStat.lognormal[property](x, mu, shape)
		},
		exponential: ({lambda}) => {
			value = jStat.exponential[property](x, lambda)
		},
		weibull: ({theta, beta}) => {
			value = jStat.weibull[property](x, theta, beta)
		},
		chisquare: ({dof}) => {
			value = jStat.chisquare[property](x, dof)
		},
		centralf: ({dof1, dof2}) => {
			value = jStat.centralF[property](x, dof1, dof2)
		}
	})

	return value
}

const cdf = function(x, distribution, parameters) {
	return densityFunction("cdf", x, distribution, parameters)
}

const pdf = function(x, distribution, parameters) {
	return densityFunction("pdf", x, distribution, parameters)
}

const cdfInverse = function(p, distribution, parameters) {
	return densityFunction("inv", p, distribution, parameters)
}

export default {
	meanOf,
	medianOf,
	modeOf,
	sampleOf,
	varianceOf,
	cdf,
	pdf,
	cdfInverse
}
