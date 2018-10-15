import Api from "./BaseAPI"

const defaultErrorHandler = function(err) {
    if (err.response) {
        console.log("err response", err.response)
        let status = err.response.status
        let statusText = err.response.statusText
        throw {
            error: "Error in Response Object",
            status,
            msg: statusText
        }
    }
    if (err.request) {
        console.log("err request", err.request)
        let status = err.request.status
        let statusText = err.request.statusText
        console.log(err.request)
        throw {
            error: "Error in Request Object",
            status,
            msg: statusText
        }
    }

    throw {
        error: "Unknown Error",
        msg: err.toString()
    }
}

function importFailureRecords(formData) {
    return Api()
        .post("/imports/failure-records", formData)
        .then((res) => {
            return {
                meta: res.data,
                result: res.data.result
            }
        })
        .catch((err) => {
            defaultErrorHandler(err)
        })
}

function importMaintenanceCost(subsystemData, formData) {
    for (let i = 0; i < subsystemData.length; i++) {
        let sub = subsystemData[i]
        formData.append(`subsystem-data`, JSON.stringify(sub))
    }

    return Api()
        .post("/imports/maintenance-cost", formData)
        .then((res) => {
            return res.data.result
        })
        .catch((err) => {
            defaultErrorHandler(err)
        })
}

const ImportAPI = {
    importFailureRecords,
    importMaintenanceCost
}

export {ImportAPI}
