<template>
    <base-container
        :border="border"
        :shadow="shadow">
        <div class="padded-content">
            <div class="c_rate-card-title">
                {{title}}
            </div>
            <div class="c_rate-card-value vspace-sm"
                 :style="{color: textColor}">
                {{formatValue(value)}}
                <span v-if="unit === '%'"> %</span>
            </div>
            <div
                v-if="unit !== '%'"
                class="c_rate-card-value-unit"
                :style="{color: textColor}">
                {{unit}}
            </div>
        </div>
    </base-container>
</template>

<script>
    import BaseContainer from "../Container/BaseContainer"
    import numeral from "numeral"

    export default {
        name: "simple-value-card",
        components: {BaseContainer},
        props: {
            title: String,
            value: [Number, String],
            unit: String,
            shadow: {
                type: [String, Boolean],
                default: false
            },
            border: {
                type: Boolean,
                default: false
            },
            textColor: {
                type: String,
                default: "#1e88e5"
            }
        },
        data() {
            return {}
        },
        computed: {},
        methods: {
            formatValue(value) {
                return this._.isNumber(value)
                    ? numeral(value).format("0[.]00000")
                    : value
            },
        }
    }
</script>

<style scoped lang="scss">
    .c_rate-card-title {
        @extend %container-title-large;
        color: $clr-light-blue-300 !important;
    }

    .c_rate-card-value {
        display: block;
        font-size: 20px;
        font-weight: 500;
    }

    .c_rate-card-value-unit {
        display: block;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
    }
</style>
