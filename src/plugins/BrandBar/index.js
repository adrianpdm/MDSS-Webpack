import BrandBar from "./BrandBar"

const store = []

const BrandBarPlugin = {
    install(Vue) {

        Vue.mixin({
            data() {
                return {
                    brandBarStore: store
                }
            }
        })

        Object.defineProperty(Vue.prototype, "$brandBar", {
            get() {
                return this.$root.brandBarStore
            }
        })

        Vue.component("brand-bar", BrandBar)
    }
}

export default BrandBarPlugin
