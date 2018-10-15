<template>
    <base-layout>
        <div slot="aside" class="c_aside-explorer">
            <span
                class="c_aside-explorer-title clr-orange"
                style="padding: 0 10px 0 5px;">
            Explore
            </span>
            <tree-view
                ref="treeView"
                class="vspace-sm"
                @node-item-click="onMachineTreeNodeClick"
                :nodes="machineTreeNodes"/>
        </div>
        <div slot="main" style="height: 100%; overflow: hidden">
            <el-tabs
                v-if="insertedTabs.length > 0"
                type="card"
                class="tab-layout c_tab-layout"
                :closable="true"
                v-model="currentActiveTab"
                @tab-remove="onRemoveTab">
                <el-tab-pane
                    v-for="tab in insertedTabs"
                    :key="tab.id"
                    :name="tab.id">
                    <span slot="label">
                        <span class="c_tab-item-symbol" :class="tab.symbolClass">{{tab.symbol}}</span>
                        {{tab.text}}
                    </span>
                    <transition name="slideY-fade" mode="out-in" appear>
                        <component
                            :is="getComponentType(tab.type)"
                            v-bind="getComponentProperties(tab.type, tab.value)"/>
                    </transition>
                </el-tab-pane>
            </el-tabs>
        </div>
    </base-layout>
</template>

<script>
    import MachineData from "../../components/Views/MachineData/MachineData"
    import SubsystemData from "../../components/Views/SubsystemData/SubsystemData"
    import BaseLayout from "../Base/BaseLayout"

    export default {
        name: "data-explorer",
        components: {BaseLayout},
        data() {
            return {
                pageRoutePath: "/data",
                insertedTabs: [],
                currentActiveTab: "",
            }
        },
        beforeMount() {
            this.insertedTabs = [].concat(this.$store.state.view_state.dataExplorerInsertedTabs)
            this.currentActiveTab = this.$store.state.view_state.dataExplorerCurrentActiveTab
        },
        mounted() {

        },
        computed: {
            machineTreeNodes() {
                return this.$store.getters.getMachineTreeNodes
            }
        },
        methods: {
            saveSelectedMachineTreeNode(nodeItem) {

            },
            onMachineTreeNodeClick(node, item) {
                this.currentActiveTab = item.id
                this.insertTab(item)
                this.saveSelectedMachineTreeNode(item)
            },
            getTabType({id, level, value, symbol, symbolClass, icon}) {
                let text, type
                if (value.machineId && !value.subsystem) {
                    type = "machine"
                    text = `${value.machineId} ${this.toTitleCase(value.mfc)}`
                } else if (value.subsystem) {
                    type = "subsystem"
                    text = `${value.machineId} : ${value.subsystem}`
                }

                return {id, level, type, text, symbol, symbolClass, icon, value}
            },
            insertTab(nodeItem) {
                let thisTab = this.getTabType(nodeItem)

                let isExist = this._.find(this.insertedTabs, function(tab) {
                    return thisTab.id === tab.id
                })
                if (isExist) {
                    return
                }

                this.$set(this.insertedTabs, this.insertedTabs.length, thisTab)
                this.currentActiveTab = thisTab.id
            },
            onRemoveTab(tabID) {
                let removedIndex = this._.findIndex(this.insertedTabs, function(tab) {
                    return tab.id === tabID
                })

                let removedTab = this.insertedTabs[removedIndex]
                if (removedTab.id === this.currentActiveTab) {
                    let tabToSwitch = this.insertedTabs[removedIndex + 1] || this.insertedTabs[removedIndex - 1]

                    if (tabToSwitch) {
                        this.currentActiveTab = tabToSwitch.id
                    } else {
                        this.currentActiveTab = ""
                    }
                }
                this.$delete(this.insertedTabs, removedIndex)
            },
            getComponentType(type) {
                switch (type) {
                    case "machine":
                        return MachineData
                    case "subsystem":
                        return SubsystemData
                }
            },
            getComponentProperties(type, nodeItemValue) {
                switch (type) {
                    case "machine":
                        return {
                            machineId: nodeItemValue.machineId
                        }
                    case "subsystem":
                        return {
                            machineId: nodeItemValue.machineId,
                            subsystem: nodeItemValue.subsystem
                        }
                }
            },
        },
        watch: {},
        beforeRouteLeave(to, from, next) {
            this.$store.commit("save-data-explorer-inserted-tabs", this.insertedTabs)
            this.$store.commit("save-data-explorer-current-active-tab", this.currentActiveTab)
            next()
        }
    }
</script>

<style scoped lang="scss">
    .c_aside-explorer {
        @include box-sizing(border-box);
        padding: 12px;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: $clr-grey-50;
    }

    .c_aside-explorer-title {
        @extend %container-title-large;
    }

    .c_tab-item-symbol {
        margin-right: 4px;
        font-weight: 700 !important;
    }

    .c_tab-layout {
        @include box-sizing(border-box);
        width: 100%;
        height: 100%;
    }

    .c_tab-layout /deep/ {
        > .el-tabs__header {
            @include shadow-style();
            z-index: 5;
        }

        > .el-tabs__content {
            @include box-sizing(border-box);
            width: 100%;
            height: 100%;
        }

        > .el-tabs__content .el-tab-pane {
            @include box-sizing(border-box);
            width: 100%;
            height: calc(100% - 40px);
        }
    }

</style>
