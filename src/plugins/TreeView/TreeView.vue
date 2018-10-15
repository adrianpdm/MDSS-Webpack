<template>
    <v-jstree
        :data="nodes"
        :allow-transition="false"
        @item-click="onNodeItemClick">
        <template slot-scope="node">
            <div class="c_node-item-container">
                <span
                    class="c_node-item-symbol"
                    :class="node.model.symbolClass">
                  {{node.model.symbol}}
                </span>
                <i
                    v-if="node.model.icon && node.model.icon !== ''"
                    :class="node.vm.themeIconClasses">
                </i>
                <span>{{node.model.text}}</span>
            </div>
        </template>
    </v-jstree>
</template>

<script>
    export default {
        name: "tree-view",
        props: {
            nodes: {
                type: Array,
                required: true,
                default: () => []
            }
        },
        data() {
            return {
                cachedSearchedNode: undefined
            }
        },
        computed: {},
        methods: {
            onNodeItemClick(node, item) {
                this.$emit("node-item-click", node, item)
            },
        }
    }
</script>

<style scoped lang="scss">
    .c_node-item-container {
        display: block;

        > span.c_node-item-symbol {
            font-weight: 700;
        }

        > span {
            font-size: 13px;
            display: inline-block;
            vertical-align: middle;
            padding-left: 0;
        }

        > span + span {
            margin-left: 4px;
        }
    }
</style>
