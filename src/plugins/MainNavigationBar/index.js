import MainNavigationBar from "./MainNavigationBar"

const links = [
    {
        label: "Data Explorer",
        path: "/data",
    },
    {
        label: "Tasks",
        path: "/tasks",
        children: [
            {label: "Maintenance Scheduling", path: "/tasks/maint-sch"},
        ]
    }
]

const NavbarStore = {
    links
}

const NavbarPlugin = {
    install(Vue) {

        Vue.mixin({
            data() {
                return {
                    navbarStore: NavbarStore
                }
            }
        })

        Object.defineProperty(Vue.prototype, "$navbar", {
            get() {
                return this.$root.navbarStore
            }
        })

        Vue.component("main-navigation-bar", MainNavigationBar)
    }
}

export default NavbarPlugin
