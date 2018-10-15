import Api from "./BaseAPI"

function getDefaultConfig() {
    return Api()
        .get("/config/default-config")
        .then((res) => {
            return res.data.config
        })
        .catch((err) => {
            console.error(err)
        })
}

export default {
    getDefaultConfig
}
