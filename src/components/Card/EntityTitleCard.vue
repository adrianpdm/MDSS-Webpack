<template>
    <div class="c_entity-title-card clearfix">
        <div class="c_entity-type-title"
             :style="{backgroundColor: entityCardType.backgroundColor}">
            {{entityCardType.header}}
        </div>
        <div class="c_entity-info-block">
            <template v-for="(info, i) in entityCardType.fields">
                <div class="c_entity-title-card-info"
                     :key="`info-${i}-${info.prop}`">
                    <span class="field">{{info.label}}</span>
                    <span class="value">{{formatValue(info.prop, info.value)}}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {stringFormatter} from "../../store/functions"

    export default {
        name: "entity-title-card",
        props: {
            machineId: {
                type: String,
            },
            subsystem: {
                type: String,
            }
        },
        data() {
            return {}
        },
        computed: {
            machineInfo() {
                return [
                    {prop: "machineId", label: "Machine ID", value: this.machineId},
                    {prop: "mfc", label: "Manufacturer", value: this.machineData.mfc},
                    {prop: "desc", label: "Description", value: this.machineData.desc},
                    {prop: "type", label: "Facility Type", value: this.machineData.type},
                    {prop: "count", label: "Subsystems Observed", value: this.machineData.subsystems.length}
                ]
            },
            subsystemInfo() {
                return [
                    {prop: "subsystem", label: "Subsystem", value: this.subsystem},
                    {prop: "machineId", label: "Machine ID", value: this.machineId},
                    {prop: "mfc", label: "Manufacturer", value: this.machineData.mfc},
                    {prop: "desc", label: "Description", value: this.machineData.desc},
                    {prop: "type", label: "Facility Type", value: this.machineData.type}
                ]
            },
            entityCardType() {
                if (this.machineId && !this.subsystem) {
                    return {
                        type: "machine",
                        header: `Machine`,
                        title: `${this.machineData.machineId} - ${this.toTitleCase(this.machineData.mfc)}`,
                        backgroundColor: "#ff5722",
                        fields: this.machineInfo,
                    }
                } else if (this.subsystem) {
                    return {
                        type: "subsystem",
                        header: `Subsystem`,
                        title: this.subsystem,
                        backgroundColor: "#00c853",
                        fields: this.subsystemInfo,
                    }
                }
            },
            machineData() {
                return this.$store.getters.getMachineDataById({
                    machineId: this.machineId
                })
            },
            cardBodyStyle() {
                return {
                    padding: "12px 16px",
                    background: this.entityCardType.background,
                }
            },
        },
        methods: {
            stringFormatter,
            formatValue(prop, value) {
                return this.stringFormatter(prop, value)
            },
        }
    }
</script>

<style scoped lang="scss">
    .c_entity-title-card {
        display: block;
        position: relative;
        border: none !important;
        border-radius: 8px;
        background-color: $clr-white;
        overflow: hidden;
        @include shadow-style();
    }

    .c_entity-type-title {
        @include box-sizing(border-box);
        background-color: $clr-blue;
        min-width: 135px;
        padding: 12px;
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        font-size: 16px;
        font-weight: 700;
        color: white;
        letter-spacing: 0.08em;
        text-transform: uppercase;
    }

    .c_entity-info-block {
        display: table-cell;
        padding: 12px;
        vertical-align: middle;
    }

    .c_entity-title-card-info {
        position: relative;
        display: inline-block;
        vertical-align: top;

        > span.field {
            display: block;
            font-size: 13px;
            font-weight: 500;
            color: $clr-grey-600;
        }
        > span.value {
            display: block;
            font-size: 20px;
            font-weight: 700;
            color: $clr-grey-800;
        }
    }

    .c_entity-title-card-info:first-of-type,
    .c_entity-title-card-info + .c_entity-title-card-info {
        margin-right: 24px;
    }
</style>
