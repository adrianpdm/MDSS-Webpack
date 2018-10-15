const _isArray = require("lodash").isArray
const _flatten = require("lodash").flatten
const _forEach = require("lodash").forEach

const tableHeaders = {
	responsibleCode: "ResponsibleCode",
	codification: "Codification",
	description: "Description",
	manufacturer: "Manufacturer",
	facType: "FacType",
	subsystem: "SubSystem",
	issuedDate: "IssuedDate",
	issuedTime: "IssuedTime",
	deliveryDate: "DeliveryDate",
	deliveryTime: "DeliveryTime",
	totDowntime: "TotDownTime",
	totTimeToRepair: "TotMTTR",
	jobType: "JobType",
	failureType: "FailureType",
	failureCause: "Penyebab",
	rateOfMachine: "RateMach",
	pmHours: "PMHours",
	pmMaterialCost: "PMMaterialCost",
	pmManHourCost: "PMManHoursCost",
	pmManPower: "PMManPower",
	cmHours: "CMHours",
	cmMaterialCost: "CMMaterialCost",
	cmManHourCost: "CMManHoursCost",
	cmManPower: "CMManPower",
	status: "Status"
}

const withoutPMInterval = getTimePointsForInterval(4000, 0)
const pmInterval = [2000, 4000]

function getTimePointsForInterval(interval, start = 0) {
	const timeStep = 250
	let result = []

	if (start === 0) {
		result.push(0)
	}

	let numberOfPoints = (interval - start) / timeStep
	for (let i = 1; i <= numberOfPoints; i++) {
		let point = start + i * timeStep
		result.push(point)
	}

	result.push(interval - 24)

	return result.sort(function(a, b) {
		return a - b
	})
}

function getIntervalTimePoints(...interval) {
	if (_isArray(interval)) {
		interval = _flatten(interval)
	}

	let result = []
	_forEach(interval, function(int, index) {
		let T = index === 0
			? int
			: int - interval[index - 1]

		let timeReference = index === 0
			? 0
			: interval[index - 1]

		let points = getTimePointsForInterval(int, timeReference)

		result.push({
			interval: int,
			points,
			T,
			timeReference
		})
	})

	return result.sort(function(a, b) {
		return a - b
	})
}

module.exports = {
	tableHeaders,
	withoutPMInterval,
	pmInterval,
	getIntervalTimePoints,
	minimumDataToAnalyze: 4
}