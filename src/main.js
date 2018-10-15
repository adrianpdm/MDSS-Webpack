// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
let numeral = require("numeral")
numeral.register("locale", "id", {
    delimiters: {
        thousands: ".",
        decimal: ","
    },
    abbreviations: {
        thousand: "k",
        million: "m",
        billion: "b",
        trillion: "t"
    },
    currency: {
        symbol: "Rp"
    }
})
numeral.locale("id")


import Vue from "vue"
import App from "./App"

import Vuex from "vuex"
import store from "./store/index"

import VueRouter from "vue-router"
import routes from "./router/routes"

import ElementUI from "element-ui"
import locale from "element-ui/lib/locale/lang/en"
// import './assets/sass/_element_variables.scss';
import "./assets/sass/mdss-client.scss"
import "vue2vis/dist/vue2vis.css"
// Charts
import globalChartingPlugin from "./plugins/GlobalCharting/GlobalChartingPlugin"
// Plugins
import Vuebar from "vuebar"
import FilterPlugins from "./filters"
import VueLodash from "vue-lodash"
import VueScrollTo from "vue-scrollto"
import VueJSTree from "vue-jstree"

import ActivityBar from "./plugins/BrandBar"
import MainNavigationBar from "./plugins/MainNavigationBar"
import TreeView from "./plugins/TreeView"

const vue2vis = require("vue2vis")

Vue.use(globalChartingPlugin)

Vue.use(Vuex)
Vue.use(VueRouter)

Vue.use(FilterPlugins)
Vue.use(VueLodash)

Vue.use(ElementUI, {locale})

Vue.use(Vuebar)
Vue.use(VueScrollTo)
Vue.use(VueJSTree)

Vue.use(ActivityBar)
Vue.use(MainNavigationBar)
Vue.use(TreeView)

Vue.component("timeline", vue2vis.Timeline)


const router = new VueRouter({
    routes: routes,
    linkActiveClass: "activeLink",
})

router.beforeResolve((to, from, next) => {
    if (to.path === "/") {
        next()
        return
    }

    const isDataExist = router.app.$store.state.data_repo.isDataExist
    if (!isDataExist) {
        next({path: "/"})
    } else {
        next()
    }
})

/* eslint-disable no-new */
new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
})
