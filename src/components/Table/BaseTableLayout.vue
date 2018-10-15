<template>
    <div>
        <div v-show="withHeader" class="c_table-config padded-content">
            <span class="c_table-input-label">Headers :</span>
            <el-select
                class="collapse hspace-xs"
                :collapse-tags="true"
                placeholder="Select"
                v-model="selectedColumns"
                value-key="prop"
                size="small"
                :multiple=true>
                <el-option-group v-if="optionalColumns.length > 0" label="Optional Fields">
                    <el-option
                        v-for="(col, i) in optionalColumns"
                        :key="col.prop? `opts-${i}-${col.prop}` : `opts-${i}-${col.label}`"
                        :value="col.prop"
                        :label="col.label">
                    </el-option>
                </el-option-group>
                <el-option-group label="Required Fields">
                    <el-option
                        v-for="(col, i) in requiredColumns"
                        :key="col.prop? `req-${i}-${col.prop}` : `req-${i}-${col.label}`"
                        :value="col.prop"
                        :label="col.label"
                        disabled>
                    </el-option>
                </el-option-group>
            </el-select>
            <div class="c_pagination-container">
                <base-table-pagination-layout
                    :data-length="tableData.length"
                    :page-size="pageSize"
                    v-on:update:pagesize="val => this.pageSize = val"
                    :current-page="currentPage"
                    v-on:update:current-page="val => this.currentPage = val"/>
            </div>
        </div>
        <div class="table-content c_table-content">
            <el-table
                size="mini"
                :height="tableHeight"
                :data="slicedData"
                :fit="true"
                :border="true"
                :stripe="stripe"
                header-row-class-name="base-header-row"
                :header-row-style="headerRowStyle"
                :header-cell-style="headerCellStyle"
                :row-style="rowStyle"
                :cell-style="cellStyle"
                :span-method="tableSpanMethod">
                <el-table-column
                    v-if="withIndex"
                    fixed="left"
                    label="No."
                    width="50"
                    align="center">
                    <template slot-scope="scope">
                        {{((currentPage - 1) * pageSize) + scope.$index + 1}}
                    </template>
                </el-table-column>
                <template v-for="(column, i) in includedColumns">
                    <base-table-column
                        :key="`${column.label}-${i}`"
                        :column="column"
                        :formatter="tableDataFormatter"
                        :render-header-method="renderHeader"/>
                </template>
            </el-table>
        </div>
        <div v-show="withPagination" class="c_table-pagination padded-content">
            <span class="c_table-input-label">Total Data Entries :</span>
            <span class="c_input-read-only hspace-xs">{{tableData.length}}</span>
            <span class="hspace-sm c_table-input-label">Data per Page :</span>
            <el-select
                class="hspace-xs"
                :disabled="disableSelectPageSize"
                :value="selectPageSizeValue"
                @change="onSelectPageSizeChange"
                size="small"
                style="width: 72px;">
                <el-option
                    v-for="val in pageSizesOptions"
                    :key="val + '-perPage'"
                    :value="val">
                </el-option>
            </el-select>
            <el-checkbox-group
                class="hspace-xs"
                v-model="checkedShowAll"
                size="small"
                @change="onCheckedShowAllChange">
                <el-checkbox-button
                    label="Show All"
                    :disabled="tableData.length < 5"
                    :checked="tableData.length < 5"/>
            </el-checkbox-group>
            <div class="c_pagination-container">
                <base-table-pagination-layout
                    :data-length="tableData.length"
                    :page-size="pageSize"
                    v-on:update:pagesize="val => this.pageSize = val"
                    :current-page="currentPage"
                    v-on:update:current-page="val => this.currentPage = val"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {tableDataFormatter} from "../../store/functions"
    import BaseTableColumn from "./BaseTableColumn"
    import BaseTablePaginationLayout from "./BaseTablePaginationLayout"
    import BaseContainer from "../Container/BaseContainer"

    export default {
        name: "base-table-layout",
        components: {
            BaseContainer,
            BaseTableColumn,
            BaseTablePaginationLayout
        },
        props: {
            tableTitle: {
                type: String,
            },
            tableData: {
                type: Array,
                required: true,
            },
            tableColumns: {
                type: Array,
                required: true
            },
            tableHeight: {
                type: [Number, String],
                default: undefined
            },
            withHeader: {
                type: Boolean,
                default: true
            },
            withPagination: {
                type: Boolean,
                default: true
            },
            withBorder: {
                type: Boolean,
                default: true
            },
            headerRowStyle: Function,
            headerCellStyle: Function,
            rowStyle: Function,
            cellStyle: Function,
            stripe: {
                type: Boolean,
                default: false
            },
            withIndex: {
                type: Boolean,
                default: true
            },
            spanMethod: [Function, Array]
        },
        data() {
            return {
                currentPage: 1,
                cachedCurrentPage: 1,
                pageSize: 5,
                cachedPageSize: 5,
                selectedColumns: [],
                checkedShowAll: [],
                isCheckedShowAll: false,
            }
        },
        mounted() {
            const self = this
            this._.forEach(this.tableColumns, function(c) {
                if (!c.required && c.init) {
                    self.selectedColumns.push(c.prop)
                }
            })
        },
        computed: {
            dataLength() {
                return this.tableData.length
            },
            slicedData() {
                if (!this.withPagination || this.isCheckedShowAll) {
                    return this.tableData
                }
                let first = (this.currentPage - 1) * this.pageSize
                let end = (this.currentPage * this.pageSize)
                return this._.slice(this.tableData, first, end)
            },
            pageSizesOptions() {
                let n = this.dataLength
                if (n >= 20) {
                    return [5, 10, 20]
                } else if (n >= 5) {
                    return [5, 10]
                } else {
                    return []
                }
            },
            selectPageSizeValue() {
                if (this.dataLength < 5) {
                    return "-"
                } else {
                    return this.pageSize
                }
            },
            disableSelectPageSize() {
                return this._.includes(this.checkedShowAll, "Show All")
                    || this.dataLength < 5
            },
            requiredColumns() {
                let cols = []
                this._.forEach(this.tableColumns, function(col) {
                    if (col.required) {
                        cols.push(col)
                    }
                })
                return cols
            },
            optionalColumns() {
                let cols = []
                this._.forEach(this.tableColumns, function(col) {
                    if (!col.required) {
                        cols.push(col)
                    }
                })
                return cols
            },
            includedColumns() {
                let cols = []
                this._.forEach(this.tableColumns, (col) => {
                    let i1 = this._.find(this.requiredColumns, function(o) {
                        return col.prop === o.prop
                    })

                    if (i1) {
                        cols.push(col)
                        return
                    }

                    let i2 = this._.find(this.selectedColumns, function(val) {
                        return col.prop === val
                    })

                    if (i2) {
                        cols.push(col)
                    }
                })
                return cols
            },
            tableSpanMethod() {
                return this.spanMethod
                    ? this.spanMethod
                    : () => [1, 1]
            }
        },

        methods: {
            tableDataFormatter: tableDataFormatter,
            onCheckedShowAllChange(value) {
                if (this._.includes(value, "Show All")) {
                    this.cachedPageSize = this.pageSize
                    this.cachedCurrentPage = this.currentPage
                    this.currentPage = 1
                    this.pageSize = this.tableData.length
                    this.isCheckedShowAll = true
                } else {
                    this.pageSize = this.cachedPageSize
                    this.currentPage = this.cachedCurrentPage
                    this.isCheckedShowAll = false
                }
            },
            onSelectPageSizeChange(value) {
                this.pageSize = value
            },
            renderHeader(h, {column, $index}) {
                const self = this
                let columnTitle = h(
                    "span",
                    {
                        style: {
                            display: "block",
                            height: "100%",
                            width: "100%",
                        },
                        slot: "reference"
                    },
                    [column.label]
                )

                let popoverTitle = h(
                    "span",
                    {
                        domProps: {
                            innerHTML: "Actions"
                        },
                        style: {
                            display: "block",
                            marginBottom: "12px",
                        }
                    },
                )

                let popoverActions = h(
                    "el-button",
                    {
                        domProps: {
                            innerHTML: "Copy column data"
                        },
                        props: {
                            type: "text",
                            size: "mini"
                        },
                        on: {
                            click: function() {
                                self.onTableHeaderPopoverClick()
                            }
                        },
                    }
                )

                let popover = h(
                    "el-popover",
                    {
                        props: {
                            placement: "bottom-start",
                            width: "100",
                            trigger: "click"
                        },
                    },
                    [popoverActions, columnTitle]
                )

                return popover
            },
            onTableHeaderPopoverClick() {

            },
        }
    }
</script>

<style scoped lang="scss">
    .c_table-title {
        @include box-sizing(border-box);
        position: relative;
        border: none;
        background: white;

        .c_table-title-text {
            @extend %container-title;
        }

        .c_table-title-text-large {
            @extend %container-title-large;
        }
    }

    .c_table-config {
        @include box-sizing(border-box);
        position: relative;
        border-top: 1px solid $clr-grey-300 !important;
        border-bottom: 1px solid $clr-grey-300 !important;
    }

    .c_table-pagination {
        @include box-sizing(border-box);
        position: relative;
        width: 100%;
        border: none;
    }

    .c_table-config > *,
    .c_table-pagination > * {
        display: inline-block;
        vertical-align: middle;

        &.c_pagination-container {
            float: right;
        }

        &.c_pagination-container /deep/ > .el-pagination {
            padding: 0 !important;

            $button-background-color: transparentize($clr-blue, 0.9);
            button:first-of-type {
                background-color: $button-background-color;
                margin-left: 0 !important;
            }

            button:last-of-type {
                background-color: $button-background-color;
                margin-right: 0 !important;
            }

            &.is-background .el-pager li:not(.disabled):not(.active) {
                background-color: $button-background-color;
            }
        }
    }

    .c_input-read-only {
        @include box-sizing(border-box);
        border: 1px solid $clr-grey-300;
        border-radius: 4px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0 12px;
    }

    .c_table-input-label {
        font-weight: 500;
        font-size: 12px;
        color: $clr-grey-800;
    }

</style>
