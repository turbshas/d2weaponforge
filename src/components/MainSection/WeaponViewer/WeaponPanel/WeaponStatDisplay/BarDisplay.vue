<script setup lang="ts">
import { computed } from '@vue/reactivity';

const props = defineProps<{
    statName: string,
    baseDisplayValue: number,
    displayTotal: number,
    displayModifier: number,
}>();

const filledWidthPercent = computed(() => props.displayModifier > 0 ? props.baseDisplayValue : props.displayTotal);
const displayModifierMagnitude = computed(() => Math.abs(props.displayModifier));
const modifierSign = computed(() => props.displayModifier > 0 ? "+" : "");
const modifierText = computed(() => `${modifierSign.value}${props.displayModifier}`);

const statValueLabel = computed(() => `${props.statName} Value`);
const statModifierLabel = computed(() => `${props.statName} Value Change`);

const backgroundLinearGradient = computed(() => {
    const white = "var(--white)";
    const modifierColour = props.displayModifier > 0 ? "var(--uiPositive_500)" : "var(--uiNegative_500)";
    const emptyColour = "hsla(0, 0%, 98%, 0.2)";

    const modifierColourStart = `${filledWidthPercent.value}%`;
    const modifierColourEnd = `${filledWidthPercent.value + displayModifierMagnitude.value}%`;

    const filledRange = `${white}, ${white} ${modifierColourStart}`;
    // Includes ending comma to be able to remove modifier from gradient.
    const modifierRange = `${modifierColour} ${modifierColourStart}, ${modifierColour} ${modifierColourEnd},`;
    const emptyRange = `${emptyColour} ${modifierColourEnd}, ${emptyColour}`;

    const isModified = displayModifierMagnitude.value !== 0;

    return `linear-gradient(to right, ${filledRange}, ${isModified ? modifierRange : ""} ${emptyRange})`;
});
</script>

<template>
    <div
        class="bar"
        :class="{ 'positive': displayModifier > 0, 'negative': displayModifier < 0, }"
        :style="{ 'background': backgroundLinearGradient, }"
    >
        <span :aria-label="statValueLabel">{{ props.displayTotal }}</span>
        <span v-if="props.displayModifier !== 0" class="modifier" :aria-label="statModifierLabel">({{ modifierText }})</span>
    </div>
</template>

<style scoped lang="less">

.bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    padding-left: 0.25rem;

    font-size: 0.75rem;
    font-weight: 500;
    color: var(--black);

    &.positive, &.negative {
        font-weight: 600;
    }
    &.positive {
        color: var(--uiPositive_700);
    }
    &.negative {
        color: var(--uiNegative_700);
    }
}

.modifier {
    margin-left: 0.25rem;
    font-weight: 500;
}
</style>
