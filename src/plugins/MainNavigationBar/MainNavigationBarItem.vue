<template>
    <el-submenu
        v-if="isSubMenu"
        popper-class="c_navbar-popup"
        class="c_default-menu-item"
        :class="isActiveClass"
        :show-timeout="150"
        :hide-timeout="150"
        :disabled="disableMenu"
        :index="index">
        <template slot="title">
            <span>{{menu.label}}</span>
        </template>
        <template v-for="(submenu, submenuIndex) in menu.children">
            <main-navigation-bar-item
                :key="`${index}-${submenuIndex}`"
                :menu="submenu"
                :index="`${index}-${submenuIndex}`"
            />
        </template>
    </el-submenu>

    <el-menu-item-group
        v-else-if="isSubMenuGroup"
        :title="menu.groupName">
        <template v-for="(submenu, submenuIndex) in menu.children">
            <main-navigation-bar-item
                :key="`${index}-${submenuIndex}`"
                :menu="submenu"
                :index="`${index}-${submenuIndex}`"/>
        </template>
    </el-menu-item-group>

    <el-menu-item
        v-else
        @click="el => onNavBarItemClick(el, index, menu.path)"
        class="c_default-menu-item"
        :class="isActiveClass"
        :disabled="disableMenu"
        :index="index">
        {{menu.label}}
    </el-menu-item>
</template>

<script>
    export default {
        name: "main-navigation-bar-item",
        props: {
            menu: {
                type: Object,
                required: true
            },
            index: {
                type: String,
                required: true
            }
        },
        data() {
            return {}
        },
        mounted() {

        },
        computed: {
            disableMenu() {
                return !this.$store.state.data_repo.isDataExist
            },
            isSubMenu() {
                let menu = this.menu
                return menu.hasOwnProperty("children")
                    && menu.children.length > 0
            },
            isSubMenuGroup() {
                let menu = this.menu
                return menu.hasOwnProperty("groupName")
                    && menu.children.length > 0
            },
            isActive() {
                return this.$route.path.startsWith(this.menu.path)
            },
            isActiveClass() {
                return {
                    "activeLink": this.isActive,
                }
            }
        },
        methods: {
            onNavBarItemClick(el, index, path) {
                if (this.$route.path.startsWith(path)) {
                    return
                } else if (path.startsWith("/tasks")) {
                    this.$alert('This feature is not available on Github Pages ', {
                        confirmButtonText: 'OK',
                        type: 'error'
                    })
                    return
                }
                this.$router.push({
                    path: path
                })
            }
        },
        watch: {}
    }
</script>

<style scoped lang="scss">
    .c_default-menu-item {
        font-weight: 400 !important;
    }

    .c_default-menu-item:hover,
    .c_default-menu-item:focus {
        background: none !important;
    }

    .c_default-menu-item.is-active,
    .c_default-menu-item.is-active.el-submenu,
    .c_default-menu-item.is-active.el-submenu /deep/ > * {
        border: none;
    }

    .c_default-menu-item.activeLink {
        border-bottom: 2px solid $clr-blue-400 !important;
        color: $clr-blue-400 !important;
        font-weight: 500 !important;
    }

    .c_default-menu-item.activeLink > .el-submenu__title > span {
        color: $clr-blue-400 !important;
        font-weight: 500 !important;
    }

    .c_navbar-popup {
        .c_default-menu-item.activeLink {
            border: none !important;
        }
        .c_default-menu-item.activeLink::after {
            position: relative;
            display: inline-block;
            vertical-align: baseline;
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 4px;
            margin-left: 8px;
            background-color: $clr-blue-400;
        }
    }

</style>
