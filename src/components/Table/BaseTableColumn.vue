<template>
    <el-table-column
        v-if="isColumnGroup"
        header-align="center"
        :label="column.label">
        <template v-for="(subcolumn, subIndex) in column.children">
            <base-table-column
                :key="`${column.label}-${subIndex}-${subcolumn.label}`"
                :column="subcolumn"
                :formatter="formatter"
            />
        </template>
    </el-table-column>
    <el-table-column
        v-else-if="column.type === Boolean"
        v-bind="booleanColumnProps">
        <template slot-scope="scope">
            <div v-html="contentForBooleanType(scope.row[column.prop])"></div>
        </template>
    </el-table-column>
    <el-table-column
        v-else-if="column.templateFunction"
        v-bind="customColumnProps">
        <template slot-scope="scope">
            <div v-html="column.templateFunction(scope)"></div>
        </template>
    </el-table-column>
    <el-table-column
        v-else
        v-bind="baseColumnProps"/>
</template>

<script>
    export default {
        name: "base-table-column",
        props: {
            column: {
                type: Object,
                required: true
            },
            formatter: {
                type: Function,
            },
            renderHeaderMethod: {
                type: Function
            }
        },
        data() {
            return {
                popoverVisible: false,
                baseColumnProps: {
                    property: this.column.prop,
                    label: this.column.label,
                    formatter: this.formatter,
                    headerAlign: this.column.headerAlign,
                    width: this.column.width,
                    align: this.column.align,
                    renderHeader: this.renderHeaderMethod
                }
            }
        },
        computed: {
            isColumnGroup() {
                return this.column.hasOwnProperty("children") && this.column.children.length > 0
            },
            customColumnProps() {
                return this._.pick(this.baseColumnProps, [
                    "label",
                    "formatter",
                    "headerAlign",
                    "width",
                    "align",
                    "renderHeader"
                ])
            },
            booleanColumnProps() {
                return this._.pick(this.baseColumnProps, [
                    "label",
                    "headerAlign",
                    "align",
                    "renderHeader"
                ])
            }
        },
        methods: {
            contentForBooleanType(isTrue) {
                return isTrue ? `<span>\u2714</span>` : ""
            }
        },
    }
</script>

<style scoped>

</style>
