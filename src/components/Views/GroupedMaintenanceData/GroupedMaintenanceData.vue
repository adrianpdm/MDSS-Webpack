<template>
    <div :key="`grouped-maintenance-for-${groupCode}`">
        <div>
            <entity-title-card
                :group-code="groupCode"
            />
            <div>
                <el-tabs
                    class="tabbed-content"
                    type="border-card"
                    v-model="currentActiveTab">
                    <el-tab-pane name="recommendedPolicy" label="Recommended Policy">
                        asd
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>

<script>
    import EntityTitleCard from "../../Card/EntityTitleCard"

    export default {
        name: "grouped-maintenance-data",
        components: {EntityTitleCard},
        props: {
            groupCode: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                currentActiveTab: ""
            }
        },
        methods: {
            initPage() {
                this.currentActiveTab = "recommendedPolicy"
            }
        },
        beforeMount() {
            this.initPage()
        }
    }
</script>

<style scoped>

</style>
