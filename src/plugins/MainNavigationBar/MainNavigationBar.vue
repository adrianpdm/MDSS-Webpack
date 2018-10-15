<template>
    <el-menu
        id="navbar"
        mode="horizontal">
        <template v-for="(menu, menuIndex) in menus">
            <main-navigation-bar-item
                :key="`menu-${menuIndex}`"
                :menu="menu"
                :index="`${menuIndex}`">
            </main-navigation-bar-item>
        </template>
    </el-menu>
</template>

<script>
    import MainNavigationBarItem from "./MainNavigationBarItem"

    export default {
        name: "navbar",
        components: {
            MainNavigationBarItem
        },
        computed: {},
        data() {
            return {
                menus: this.$navbar.links,
            }
        },
        methods: {},
        watch: {}
    }
</script>

<style scoped lang="scss">
    #navbar {
        @include box-sizing(border-box);
        position: relative;
        background-color: white;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    #navbar.el-menu--horizontal {
        border: none;
    }
</style>
