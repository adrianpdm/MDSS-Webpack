<template>
    <el-pagination
        :background="true"
        layout="->, prev, pager, next"
        @size-change="onPaginationPageSizeChange"
        @current-change="onPaginationPageChange"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        :current-page="currentPage"
        :pager-count="5"
        :total="dataLength">
    </el-pagination>
</template>

<script>
    export default {
        name: "table-pagination",
        props: {
            dataLength: {
                type: Number,
                required: true
            },
            pageSize: {
                type: Number,
                default: 5
            },
            currentPage: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {}
        },
        computed: {
            pageSizes() {
                let n = this.dataLength
                if (n >= 20) {
                    return [5, 10, 20]
                } else if (n >= 10) {
                    return [5, 10]
                } else if (n > 5) {
                    return [5]
                } else {
                    return []
                }
            }
        },
        methods: {
            onPaginationPageChange(currentPage) {
                this.$emit("update:current-page", currentPage)
            },
            onPaginationPageSizeChange(pageSize) {
                this.$emit("update:page-size", pageSize)
            }
        }
    }
</script>

<style scoped>

</style>
