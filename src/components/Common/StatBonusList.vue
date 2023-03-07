<script setup lang="ts">

interface ITooltipBonus {
    statName: string;
    value: number;
}

const props = defineProps<{
    bonuses: ITooltipBonus[],
}>();

function textForStatValue(value: number) {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value}`;
}
</script>

<template>
    <ul class="stats-list">
        <li class="item" v-for="(bonus, index) of props.bonuses" :key="index">
            <span class="name">{{ bonus.statName }}</span>
            <span
                class="value"
                :class="{ 'positive': bonus.value > 0, 'negative': bonus.value < 0, }"
            >{{ textForStatValue(bonus.value) }}</span>
        </li>
    </ul>
</template>

<style scoped lang="less">
.stats-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    margin: 0;
    padding: 0;
    list-style-type: none;

    .item {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;

        line-height: 1.15rem;
        font-size: 1rem;
    }
    .name {
        display: flex;
        align-items: center;
        padding-right: 1rem;

        font-size: 0.8rem;
        line-height: 0.8rem;
        text-align: right;
    }
    .value {
        display: flex;
        align-items: center;
        flex-basis: 60%;
        font-size: 0.8rem;

        &.positive {
            color: var(--uiPositive_300);
        }
        &.negative {
            color: var(--uiNegative_300);
        }
    }
}
</style>
