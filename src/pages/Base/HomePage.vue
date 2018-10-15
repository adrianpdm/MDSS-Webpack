<template>
    <base-layout
        id="main-content"
        key="homepage"
        header-size="large">
        <main-navigation-bar slot="header"/>
        <template slot="main">
            <transition name="slideY-fade" mode="out-in">
                <div
                    class="c_container"
                    v-if="isInitial">
                    <el-button
                        type="success"
                        @click="onOpenExcelFile"
                    >
                        Open Machine Data in Excel
                    </el-button>
                    <el-button
                        type="primary"
                        @click="onStartAnalyze"
                    >
                        Analyze Machine Data
                    </el-button>
                </div>
                <router-view
                    v-else
                    key="data-found"/>
            </transition>
        </template>
    </base-layout>
</template>

<script>
    import BaseLayout from "./BaseLayout"
    import jsonData from "../../../dummydata.json"

    export default {
        name: "HomePage",
        components: {
            BaseLayout
        },
        props: {},
        data() {
            return {
                isInitial: true,
                machinesData: jsonData
            }
        },
        methods: {
            onStartAnalyze() {
                this.$store.dispatch("saveDataOfMachines", this.machinesData)
                    .then(()=>{
                        this.isInitial = false
                        this.$router.push('/data')
                    })
                    .catch(()=>{

                    })
            },
            onOpenExcelFile() {

            }
        }
    }
</script>

<style scoped lang="scss">
    .c_container{
        @include box-sizing(border-box);
        height: calc(100vh - 60px - 38px);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>
