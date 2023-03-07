<script setup lang="ts">
import { computed } from 'vue';
import StatBonusList from './StatBonusList.vue';

interface ITooltipBonus {
    statName: string;
    value: number;
}

const props = defineProps<{
    description: string,
    effect: string | null,
    bonuses: ITooltipBonus[],
}>();

const showDescription = computed(() => !!props.description);
const showEffect = computed(() => !!props.effect);
const showBonuses = computed(() => props.bonuses && props.bonuses.length > 0);
</script>

<template>
    <div class="body">
        <div class="description" v-if="showDescription">{{ props.description }}</div>
        <div class="effect" v-if="showEffect">{{ props.effect }}</div>

        <div class="stats" v-if="showBonuses">
            <StatBonusList :bonuses="props.bonuses"></StatBonusList>
        </div>
    </div>
</template>

<style scoped lang="less">
.body {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    font-size: 0.8rem;
}

.description {
    font-weight: 300;
    font-style: normal;
    white-space: pre-wrap;
}

.effect {
    font-size: 0.7rem;
    font-weight: 500;
    white-space: pre-wrap;
    color: #949494;
}

.stats {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: var(--white);
}
</style>
