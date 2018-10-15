<template>
    <el-container class="c_el-container">
        <el-aside
            class="resizeable-aside"
            v-if="withAside"
            style="height: 100%; overflow: hidden;">
            <div class="c_el-aside">
                <slot name="aside"></slot>
            </div>
        </el-aside>

        <el-container class="c_el-container">
            <el-header
                v-if="withHeader"
                :height="headerHeight"
                class="c_el-header">
                <div class="c_el-header-content">
                    <slot name="header"></slot>
                </div>
            </el-header>

            <el-main
                class="c_el-main">
                <slot name="main"></slot>
            </el-main>

            <el-footer v-if="withFooter">
                <slot name="footer"></slot>
            </el-footer>
        </el-container>

    </el-container>
</template>

<script>
    export default {
        name: "base-layout",
        props: {
            headerSize: {
                type: String,
                enum: ["small", "normal", "large"],
                default: "normal"
            }
        },
        computed: {
            withHeader() {
                return this.$slots.header !== undefined
            },
            withAside() {
                return this.$slots.aside !== undefined
            },
            withFooter() {
                return this.$slots.footer !== undefined
            },
            headerHeight() {
                switch (this.headerSize) {
                    case "small":
                        return "28px"
                    case "normal":
                        return "40px"
                    case "large":
                        return "60px"

                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .c_el-container {
        width: 100%;
        height: 100%;
    }

    .c_el-aside {
        @include box-sizing(border-box);
        border-right: 1px solid $clr-grey-300;
        background-color: $clr-grey-100;
        height: 100%;
        overflow: hidden;
    }

    .c_el-header {
        @include box-sizing(border-box);
        padding: 0 !important;
        /*height: 100%;*/
        overflow: hidden;
        z-index: 10;
        border-bottom: 1px solid $clr-grey-300 !important;
    }

    .c_el-header-content {
        @include box-sizing(border-box);
        display: flex;
        flex-direction: column;
        /*height: 100%;*/
        width: 100%;
    }

    .c_el-main {
        @include box-sizing(border-box);
        display: block;
        height: 100%;
        width: 100%;
        overflow: hidden;
        z-index: 0;
    }

</style>
