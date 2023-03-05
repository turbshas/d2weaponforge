<script setup lang="ts">
import CalculationDisplay from '@/components/Common/CalculationDisplay.vue';
import ExtrasListItem from '@/components/Common/ExtrasListItem.vue';
import { WeaponCategoryHandlingValuesMap } from '@/data/curatedData/WeaponFormulas';
import type { ISelectedGear } from '@/data/interfaces';
import { DataSearchStrings } from '@/data/services';
import { computed } from 'vue';

const props = defineProps<{
    selectedGear: ISelectedGear,
}>();

const HandlingStatIndex = DataSearchStrings.StatIndices.Handling;

const weapon = computed(() => props.selectedGear.weapon.value);

const handlingValues = computed(() => weapon.value ? WeaponCategoryHandlingValuesMap.value[weapon.value.weaponCategoryRegex] : undefined);

const showHandlingTime = computed(() => !!handlingValues.value);

const allStats = computed(() => props.selectedGear.modifiedWeaponDisplayStats.value);
const handlingStat = computed(() => {
    return allStats.value
        .filter(s => s.index === HandlingStatIndex)
        .reduce((total, current) => total + current.modifiedStat, 0);
});

const readySpeed = computed(() => {
    if (!handlingValues.value) return 0;
    const valuePerPoint = handlingValues.value.ready.valuePerPoint;
    const offset = handlingValues.value.ready.offset;
    return (valuePerPoint * handlingStat.value) + offset;
});

const adsSpeed = computed(() => {
    if (!handlingValues.value) return 0;
    const valuePerPoint = handlingValues.value.ads.valuePerPoint;
    const offset = handlingValues.value.ads.offset;
    return (valuePerPoint * handlingStat.value) + offset;
});

const stowSpeed = computed(() => {
    if (!handlingValues.value) return 0;
    const valuePerPoint = handlingValues.value.stow.valuePerPoint;
    const offset = handlingValues.value.stow.offset;
    return (valuePerPoint * handlingStat.value) + offset;
});

const roundedReadySpeed = computed(() => Math.round(readySpeed.value * 100) / 100);
const roundedAdsSpeed = computed(() => Math.round(adsSpeed.value * 100) / 100);
const roundedStowSpeed = computed(() => Math.round(stowSpeed.value * 100) / 100);

const showReadySpeed = computed(() =>  showHandlingTime.value && readySpeed.value > 0);
const showAdsSpeed = computed(() => showHandlingTime.value && adsSpeed.value > 0);
const showStowSpeed = computed(() => showHandlingTime.value && stowSpeed.value > 0);
const readyText = computed(() => `${roundedReadySpeed.value} s`);
const adsText = computed(() => `${roundedAdsSpeed.value} s`);
const stowText = computed(() => `${roundedStowSpeed.value} s`);
</script>

<template>
    <ExtrasListItem label="Ready Speed" v-if="showReadySpeed">
        <CalculationDisplay :text="readyText"></CalculationDisplay>
    </ExtrasListItem>
    <ExtrasListItem label="ADS Speed" v-if="showAdsSpeed">
        <CalculationDisplay :text="adsText"></CalculationDisplay>
    </ExtrasListItem>
    <ExtrasListItem label="Stow Speed" v-if="showStowSpeed">
        <CalculationDisplay :text="stowText"></CalculationDisplay>
    </ExtrasListItem>
</template>

<style scoped lang="less">
</style>
