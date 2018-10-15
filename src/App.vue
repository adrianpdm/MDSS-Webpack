<template>
    <section id="mdss-app">
        <brand-bar/>
        <router-view id="main-content"></router-view>
    </section>
</template>

<script>
    export default {
        name: "App"
    }
</script>

<style scoped lang="scss">
    #mdss-app {
        @include box-sizing(border-box);
        height: 100vh;
        background-color: $clr-grey-200;

        > #main-content {
            height: calc(100vh - 38px);
        }
    }
</style>
