<script setup lang="ts">
import { WeaponCategoryRangeValuesMap } from '@/data/constants';
import { DataSearchStrings } from '@/data/services';
import type { ISelectedGear } from '@/data/interfaces';
import { computed } from 'vue';
import ExtrasListItem from '../../../Common/ExtrasListItem.vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const RangeStatIndex = DataSearchStrings.StatIndices.Range;
const ZoomStatIndex = DataSearchStrings.StatIndices.Zoom;

const weapon = computed(() => props.selectedGear.weapon.value ? props.selectedGear.weapon.value : undefined);

const RangefinderPerkHash = computed(() => DataSearchStrings.Misc.RangefinderPerkHash);
const weaponCategoryRegex = computed(() => weapon.value ? weapon.value.weaponCategoryRegex : "");
const rangeValues = computed(() => weaponCategoryRegex.value ? WeaponCategoryRangeValuesMap.value[weaponCategoryRegex.value] : undefined);
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
    if (!rangeValues.value) return 1;
    const adjustment = rangeValues.value.zoomAdjustment;
    const adjustedZoom = zoom.value - adjustment;
    return adjustedZoom / 10;
});

const hipFireFalloffStart = computed(() => {
    if (!rangeValues.value) return 0;
    const baseFalloffStart = rangeValues.value.baseFalloffStart;
    const rangePerStat = rangeValues.value.hipFireRangePerStat;
    console.log("hip fire values", baseFalloffStart, rangePerStat, range.value);
    return baseFalloffStart + (range.value * rangePerStat);
});

const aimDownSightsFalloffStart = computed(() => {
    return hipFireFalloffStart.value * zoomMultiplier.value * rangefinderMultiplier.value;
});

const text = computed(() => {
    console.log("calculated stats", range.value, zoom.value, rangefinderMultiplier.value);
    const roundedHipFire = Math.round((hipFireFalloffStart.value + Number.EPSILON) * 100) / 100;
    const roundedADS = Math.round((aimDownSightsFalloffStart.value + Number.EPSILON) * 100) / 100;
    return `${roundedHipFire}m / ${roundedADS}m`
});
</script>

<template>
    <ExtrasListItem label="Damage Falloff" v-if="hasRangeValues">
        <span>{{ text }}</span>
    </ExtrasListItem>
</template>

<style scoped>
</style>
