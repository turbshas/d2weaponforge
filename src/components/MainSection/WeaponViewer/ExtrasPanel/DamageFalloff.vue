<script setup lang="ts">
import CalculationDisplay from '@/components/Common/CalculationDisplay.vue';
import { WeaponCategoryRangeValuesMap, WeaponCategoryValuesArchetypeOverrideMap, WeaponCategoryValuesExoticOverrideMap } from '@/data/curatedData/WeaponFormulas';
import type { ISelectedGear } from '@/data/interfaces';
import { DataSearchStrings } from '@/data/services';
import { computed } from 'vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';

// Numbers and some calculations from: https://github.com/oh-yes-0-fps/D2_Calculation_API

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const RangeStatIndex = DataSearchStrings.StatIndices.Range;
const ZoomStatIndex = DataSearchStrings.StatIndices.Zoom;

const weapon = computed(() => props.selectedGear.weapon.value ? props.selectedGear.weapon.value : undefined);
const weaponHash = computed(() => weapon.value ? weapon.value.hash : 0);
const archetypeHash = computed(() => weapon.value && weapon.value.archetype ? weapon.value.archetype.intrinsicPerkHash : 0);

const overrideValues = computed(() =>
    WeaponCategoryValuesExoticOverrideMap.value[weaponHash.value]
    || WeaponCategoryValuesArchetypeOverrideMap.value[archetypeHash.value]);

const baseRangeValues = computed(() => weapon.value ? WeaponCategoryRangeValuesMap.value[weapon.value.weaponCategoryRegex] : undefined);
const overrideRangeValues = computed(() => overrideValues.value?.range);

const rangeValues = computed(() => overrideRangeValues.value || baseRangeValues.value);

const RangefinderPerkHash = computed(() => DataSearchStrings.Misc.RangefinderPerkHash);
const weaponCategoryRegex = computed(() => weapon.value ? weapon.value.weaponCategoryRegex : "");
const hasRangeValues = computed(() => !!rangeValues.value);

const allStats = computed(() => props.selectedGear.modifiedWeaponDisplayStats.value);

const range = computed(() => {
    return allStats.value
        .filter(s => s.index === RangeStatIndex)
        .reduce((total, current) => total + current.modifiedStat, 0);
});

const zoom = computed(() => {
    return allStats.value
        .filter(s => s.index === ZoomStatIndex)
        .reduce((total, current) => total + current.modifiedStat, 0);
});

const rangefinderMultiplier = computed(() => {
    const rangefinderPerk = props.selectedGear.perkOptionsList.value.find(p => p && p.perkOption.perk === RangefinderPerkHash.value);
    return rangefinderPerk ? 1.1 : 1;
});

const zoomMultiplier = computed(() => {
    if (!rangeValues.value || !weaponCategoryRegex.value) return 1;
    const adjustedZoom = weaponCategoryRegex.value === DataSearchStrings.WeaponCategoryRegex.FusionRifle
        ? (10 + (zoom.value / 5))
        : (zoom.value - 0.25);
    return adjustedZoom / 10;
});

const hipFireFalloffStart = computed(() => {
    if (!rangeValues.value) return 0;
    const baseFalloffStart = rangeValues.value.baseFalloffStart;
    const rangePerStat = rangeValues.value.hipFireStartPerStat;
    return baseFalloffStart + (range.value * rangePerStat);
});

const aimDownSightsFalloffStart = computed(() => {
    return hipFireFalloffStart.value * zoomMultiplier.value * rangefinderMultiplier.value;
});

const text = computed(() => {
    const roundedHipFire = Math.round((hipFireFalloffStart.value + Number.EPSILON) * 100) / 100;
    const roundedADS = Math.round((aimDownSightsFalloffStart.value + Number.EPSILON) * 100) / 100;
    return `${roundedHipFire}m / ${roundedADS}m`
});
</script>

<template>
    <ExtrasListItem label="Damage Falloff" v-if="hasRangeValues">
        <CalculationDisplay :text="text"></CalculationDisplay>
    </ExtrasListItem>
</template>

<style scoped>
</style>
