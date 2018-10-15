import TreeView from "./TreeView"
import _ from "lodash"

function recursiveFindNode(id, level, nodes) {
    let result = {}
    _.forEach(nodes, function(node) {
        if (!_.isEmpty(result)) {
            return false
        }

        if (level === 0 && node.id === id) {
            result = node
            return false
        } else if (level >= 0) {
            result = recursiveFindNode(id, level - 1, node.children)
        }
    })

    return result
}

const TreeViewStore = {
    findNode: function(id, level, nodes) {
        return recursiveFindNode(id, level, nodes)
    }
}

const TreeViewPlugin = {
    install(Vue) {

        Vue.mixin({
            data() {
                return {
                    treeViewStore: TreeViewStore
                }
            }
        })

        Vue.component("tree-view", TreeView)

        Object.defineProperty(Vue.prototype, "$treeView", {
            get() {
                return this.$root.treeViewStore
            }
        })
    }
}

export default TreeViewPlugin
