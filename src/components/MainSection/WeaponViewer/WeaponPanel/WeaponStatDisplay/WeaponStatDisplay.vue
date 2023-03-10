<script setup lang="ts">
import { StatDisplayType, StatIndex, type IModifiedStat } from '@/data/interfaces';
import { computed } from '@vue/reactivity';
import BarDisplay from './BarDisplay.vue';
import RecoilDirectionGraphic from './RecoilDirectionGraphic.vue';
import StatChangeArrow from './StatChangeArrow.vue';

const props = defineProps<{
    displayStat: IModifiedStat,
}>();

const index = computed(() => props.displayStat.index);
const name = computed(() => props.displayStat.statName);
const showStat = computed(() => !!props.displayStat.statDisplay);

const baseDisplayValue = computed(() => props.displayStat.baseStat);
const displayedTotal = computed(() => props.displayStat.modifiedStat);

const displayModifier = computed(() => displayedTotal.value - baseDisplayValue.value);
const isBenefit = computed(() => props.displayStat.isBenefit);
const hasChange = computed(() => displayModifier.value !== 0);

const statDisplayType = computed(() => {
    if (!name.value || !props.displayStat.statDisplay) return StatDisplayType.Bar;
    if (!props.displayStat.statDisplay.displayAsNumeric) return StatDisplayType.Bar;
    return index.value === StatIndex.RecoilDirection ? StatDisplayType.Angle : StatDisplayType.Number;
});
const isBarDisplayType = computed(() => statDisplayType.value === StatDisplayType.Bar);
const isAngleDisplayType = computed(() => statDisplayType.value === StatDisplayType.Angle);

const statValueLabel = computed(() => `${name.value} Value`);
</script>

<template>
    <div class="stat" v-if="showStat">
        <h4 class="name">{{ name }}</h4>

        <div class="display">
            <BarDisplay
                v-if="isBarDisplayType"
                :stat-name="name"
                :base-display-value="baseDisplayValue"
                :display-modifier="displayModifier"
                :display-total="displayedTotal"
            ></BarDisplay>

            <div class="number" v-else>
                <span
                    class="text"
                    :class="{ 'positive': hasChange && isBenefit, 'negative': hasChange && !isBenefit, }"
                    :aria-label="statValueLabel"
                >{{ displayedTotal }}</span>
                <StatChangeArrow class="arrow" v-if="displayModifier !== 0" :down="!isBenefit"></StatChangeArrow>

                <RecoilDirectionGraphic v-if="isAngleDisplayType" :stat-value="displayedTotal"></RecoilDirectionGraphic>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/mediaQueries.less";

.stat {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    height: 1.25rem;
}

.name {
    width: 30%;
    margin-right: 0.5rem;
    
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 0.875rem;
    color: var(--color-text);
    text-shadow: 0 3px 5px #0a0a0a;
    align-self: center;
    text-align: left;
    
    @media @large-screen {
        text-align: right;
    }
}

.display {
    width: 70%;
    display: flex;
}

.number {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;

    .text {
        font-size: 1rem;
        color: var(--white);
        text-shadow: 0 3px 5px #0a0a0a;
        align-self: center;

        &.positive {
            color: var(--uiPositive_300);
        }
        &.negative {
            color: var(--uiNegative_300);
        }
    }
}

.arrow {
    margin-left: 0.375rem;
    align-self: center;
}
</style>
