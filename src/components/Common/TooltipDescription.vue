<script setup lang="ts">
import type { IPerkBonus } from '@/data/interfaces';
import { computed } from 'vue';

const props = defineProps<{
    description: string,
    effect: string | null,
    bonuses: { statName: string, value: number }[],
}>();

const showDescription = computed(() => !!props.description);
const showEffect = computed(() => !!props.effect);
const showBonuses = computed(() => props.bonuses && props.bonuses.length > 0);

function keyForStatValue(bonus: IPerkBonus, index: number) {
    return `${bonus.statName}_${index}`;
}

function textForStatValue(value: number) {
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value}`;
}
</script>

<template>
    <div class="body">
        <div class="description" v-if="showDescription">{{ props.description }}</div>
        <div class="effect" v-if="showEffect">{{ props.effect }}</div>

        <div class="stats" v-if="showBonuses">
            <ul class="stats-list">
                <li class="item" v-for="(bonus, index) of props.bonuses" :key="keyForStatValue(bonus, index)">
                    <span class="name">{{ bonus.statName }}</span>
                    <span
                        class="value"
                        :class="{ 'positive': bonus.value > 0, 'negative': bonus.value < 0, }"
                    >{{ textForStatValue(bonus.value) }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped lang="less">
.body {
    display: flex;
    flex-direction: column;
    gap: 4px;

    font-size: 12.8px;
}

.description {
    font-weight: 300;
    font-style: normal;
    white-space: pre-wrap;
}

.effect {
    font-size: 11.2px;
    font-weight: 500;
    white-space: pre-wrap;
    color: #949494;
}

.stats {
    margin-top: 8px;
    padding-top: 8px;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #fafafa;
}

.stats-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
.stats-list .item {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 4px;

    line-height: 18.4px;
    font-size: 16px;
}
.stats-list .name {
    display: flex;
    align-items: center;
    padding-right: 16px;

    font-size: 12.8px;
    line-height: 12.8px;
    text-align: right;
}
.stats-list .value {
    display: flex;
    align-items: center;
    flex-basis: 60%;
    font-size: 12.8px;

    &.positive {
        color: #68cc79;
    }
    &.negative {
        color: #e25954;
    }
}
</style>
