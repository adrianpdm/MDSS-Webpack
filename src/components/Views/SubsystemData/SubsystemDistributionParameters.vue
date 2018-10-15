<template>
    <div class="c_entity-info-block">
        <template v-for="(info, i) in statisticsInfo">
            <div class="c_entity-title-card-info"
                 :key="`info-${i}-info.name`">
                <span class="field">{{info.name}}</span>
                <span class="value">{{info.value}}</span>
            </div>
        </template>
    </div>
</template>

<script>
    import numeral from "numeral"
	export default {
		name: "SubsystemDistributionParameters",
        props: {
		    title: String,
            distribution: {
		        type: String
            },
		    parameters: {
		        type: Object,
                required: true
            },
            rateType: {
		        type: String,
                required: true
            }
        },
        computed: {
		    distributionParameters() {
		        return this._.map(this.parameters, (val, key)=>{
		            return {
		                name: key,
                        value: numeral(val).format("0[.][00000]")
                    }
                })
            },
            statisticsInfo() {
		        let info = []
                info.push({
                    name: `${this.title} Distribution`,
                    value: this.distribution
                })
                info = info.concat(this.distributionParameters)
                info.push({
                    name: this.title === "MTBF" ? "Failure Rate" : "Repair Time Rate",
                    value: this.rateTypeString,
                })
                return info
            },
            rateTypeString() {
		        switch (this._.toLower(this.rateType)){
                    case "ifr":
                        return "Increasing"
                    case "ifr-dfr":
                        return "Increasing-Decreasing"
                    case "dfr":
                        return "Decreasing"
                    case "cfr":
                        return "Constant"
                    default:
                        return ""
                }
            }
        }
	}
</script>

<style scoped lang="scss">

    .c_title{
        @extend %container-title-large;
        color: $clr-light-blue-a400;
    }

    .c_entity-info-block {
        display: table-cell;
        vertical-align: middle;
    }

    .c_entity-title-card-info {
        position: relative;
        display: inline-block;
        vertical-align: top;

        > span.field {
            display: block;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            color: $clr-light-blue-a400;
        }
        > span.value {
            display: block;
            font-size: 16px;
            font-weight: 500;
            color: #00c853;
        }
    }

    .c_entity-title-card-info + .c_entity-title-card-info {
        margin-left: 24px;
    }

</style>
