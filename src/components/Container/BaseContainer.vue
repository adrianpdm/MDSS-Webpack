<template>
    <div
        class="c_base-container"
        :class="{'is-always-shadow': shadow === 'always', 'is-border': border}">
        <el-card
            shadow="none"
            :body-style="cardBodyStyle"
            style="padding: 0; border: none; height: 100%">
            <div
                class="c_base-container-header clearfix"
                :class="{'strip': stripTitle}">
                <div
                    v-show="title"
                    class="c_container-title"
                    :class="stripTitle? 'strip' : ''">
                    {{title}}
                </div>
                <div v-if="$slots.action" class="c_container-title-action">
                    <slot name="action"></slot>
                </div>
            </div>
            <slot></slot>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "base-container",
        props: {
            border: Boolean,
            shadow: {
                type: [String, Boolean],
                default: false
            },
            title: {
                type: String,
                default: undefined
            },
            stripTitle: {
                type: Boolean,
                default: false
            },
        },
        data() {
            return {
                cardBodyStyle: {
                    padding: "0",
                    height: "100%"
                },
            }
        },
        computed: {}
    }
</script>

<style scoped lang="scss">
    .c_base-container {
        @include box-sizing(border-box);
        border: none;
        border-radius: 8px;
        overflow: hidden;
        -webkit-transition: all .3s ease;
        -moz-transition: all .3s ease;
        -ms-transition: all .3s ease;
        -o-transition: all .3s ease;
        transition: all .3s ease;
    }

    .c_base-container.is-hover-shadow {

    }

    .c_base-container.is-always-shadow {
        @include shadow-style();
    }

    .c_base-container.is-border {
        border: 1px solid $clr-grey-300;
    }

    %padded-title {
        padding: 12px;
    }

    .c_base-container-header.strip {
        $border-style: 4px solid $clr-grey-100;

    }

    .c_container-title {
        @extend %container-title;
        @extend %padded-title;
        float: left;
    }

    .c_container-title.strip {
        text-transform: none !important;
        float: left;
        color: $clr-grey-700 !important;
        font-size: 19px;
        font-weight: 700;
    }

    .c_container-title-action {
        @extend %padded-title;
        float: right;
    }
</style>
