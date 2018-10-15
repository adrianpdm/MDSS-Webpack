import Vue from "vue"
import Vuex from "vuex"
// MODULES
import data_repo from "./modules/dataRepo"
import config from "./modules/config"
import view_state from "./modules/viewState"

Vue.use(Vuex)
let store = new Vuex.Store({
    strict: process.env.NODE_ENV !== "production",
    modules: {
        data_repo,
        config,
        view_state
    }
})

export default store
