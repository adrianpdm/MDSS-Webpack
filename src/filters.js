let toTitleCase = function(string) {
    if (!string) {
        return
    }
    return string.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
}

let FiltersPlugin = {

    install: function(Vue, options) {
        Vue.mixin({
            methods: {
                toTitleCase
            }
        })
    }
}

export default FiltersPlugin
export {toTitleCase as _titleCase}
