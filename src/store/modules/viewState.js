let store = {
    state: {
        dataExplorerInsertedTabs: [],
        dataExplorerCurrentActiveTab: ""
    },
    mutations: {
        "save-data-explorer-inserted-tabs"(state, tabs) {
            state.dataExplorerInsertedTabs = tabs
        },
        "save-data-explorer-current-active-tab"(state, activeTab) {
            state.dataExplorerCurrentActiveTab = activeTab
        }
    },
    actions: {},
    getters: {}
}

export default store
