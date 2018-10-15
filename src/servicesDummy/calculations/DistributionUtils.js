const _toLower = require("lodash/toLower")
const _includes = require("lodash/includes")
const _compact = require("lodash/compact")
const _findIndex = require("lodash/findIndex")
const _isEqual = require("lodash/isEqual")

const availableDistribution = [
	"normal",
	"lognormal",
	"exponential",
	"weibull",
	"chisquare",
	"centralf"
]

const SwitchDistribution = function(context, callbacks) {
	if (_compact(context).length === 0) {
		console.error("No argument passed for SwitchDistribution function")
		return
	}

	let dist = _toLower(context[0])
	let params = context[1]

	let isDistributionAvailable = _findIndex(availableDistribution, function(d){
		return _isEqual(_toLower(d), dist)
	}) !== -1

	if (!isDistributionAvailable) {
		console.error("This type of distribution not available : " + dist)
		return
	}

	if (!callbacks.hasOwnProperty(dist)) {
		console.error("No callback set for this type of distribution: " + dist)
		return
	}

	if (typeof callbacks[dist] !== "function") {
		console.error("SwitchDistribution function callbacks should be a valid function")
		return
	}

	callbacks[dist](params)
}

export {SwitchDistribution}