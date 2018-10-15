<template>
    <div class="c_not-found-container">
        <span class="c_not-found-text">
          Page not found for this URL.<br/>
          Redirecting in <span class="c_redirect-timer-sec">{{second}}</span> seconds.
        </span>
    </div>
</template>

<script>
    export default {
        name: "base-not-found-page",
        data() {
            return {
                second: 5
            }
        },
        methods: {
            redirectTimer() {
                setInterval(() => {
                    this.second -= 1
                }, 1000)
            }
        },
        watch: {
            second(val) {
                if (val < 0) {
                    clearInterval(this.redirectTimer())
                    this.$router.push("/")
                }
            }
        },
        mounted() {
            this.redirectTimer()
        }
    }
</script>

<style scoped lang="scss">
    .c_not-found-container {
        display: block;
        height: 100vh;
        width: 100vw;
        text-align: center;
    }

    span.c_not-found-text {
        display: inline-block;
        font-size: 22px;
        font-weight: 700;
        width: 100%;
        height: 100%;
        margin-top: 50vh;
    }

    span.c_redirect-timer-sec {
        color: $clr-blue-400
    }

</style>
